'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BlogPost, mockBlogPosts } from '@/types/blog'
import { Loading, EmptyState } from '@/components/ui/Feedback'

export default function BlogPostDetail() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  const loadPost = () => {
    setLoading(true)
    try {
      // 从本地数据查找文章
      const foundPost = mockBlogPosts.find(p => p.slug === slug && p.status === 'published')
      
      if (foundPost) {
        setPost(foundPost)
        
        // 获取相关文章
        const related = mockBlogPosts
          .filter(p => 
            p.id !== foundPost.id && 
            p.status === 'published' &&
            (p.category === foundPost.category || p.tags.some(t => foundPost.tags.includes(t)))
          )
          .slice(0, 3)
        
        setRelatedPosts(related)
      }
    } catch (error) {
      console.error('Failed to load post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    // 这里应该调用 API 更新点赞数
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Markdown 渲染（简化版）
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // 标题
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.slice(4)}</h3>
        }
        // 空行
        if (line.trim() === '') {
          return <br key={index} />
        }
        // 普通段落
        return <p key={index} className="mb-4 leading-relaxed">{line}</p>
      })
  }

  if (loading) {
    return <Loading message="加载文章中..." size="lg" />
  }

  if (!post) {
    return (
      <EmptyState
        icon="📝"
        title="文章未找到"
        description="这篇文章可能已被删除或不存在"
        action={{
          label: '返回博客首页',
          onClick: () => window.location.href = '/blog'
        }}
      />
    )
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回链接 */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition mb-6"
      >
        ← 返回博客
      </Link>

      {/* 文章头部 */}
      <header className="mb-8">
        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-sm bg-purple-600/30 text-purple-400 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

        {/* 摘要 */}
        <p className="text-xl text-gray-400 mb-6">{post.excerpt}</p>

        {/* 作者信息 */}
        <div className="flex items-center justify-between py-4 border-y border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-gray-500">
                发布于 {formatDate(post.publishedAt)}
                {post.updatedAt !== post.publishedAt && (
                  <> · 更新于 {formatDate(post.updatedAt)}</>
                )}
              </div>
            </div>
          </div>

          {/* 统计 */}
          <div className="flex items-center gap-4 text-gray-500">
            <span>👁 {post.views.toLocaleString()}</span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition ${
                liked ? 'text-red-400' : 'hover:text-red-400'
              }`}
            >
              {liked ? '❤️' : '🤍'} {post.likes + (liked ? 1 : 0)}
            </button>
            <span>💬 {post.comments}</span>
          </div>
        </div>
      </header>

      {/* 封面图 */}
      {post.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* 文章内容 */}
      <div className="prose prose-invert prose-lg max-w-none">
        {renderContent(post.content)}
      </div>

      {/* 分享按钮 */}
      <div className="mt-12 pt-8 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-gray-500">分享这篇文章：</div>
          <div className="flex gap-3">
            <button
              onClick={() => navigator.share?.({
                title: post.title,
                url: window.location.href
              })}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              🔗 分享
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition"
            >
              🐦 Twitter
            </button>
          </div>
        </div>
      </div>

      {/* 相关文章 */}
      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-2xl font-bold mb-6">相关文章</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="block bg-gray-900/50 border border-gray-800 rounded-xl p-4 card-hover"
              >
                <h4 className="font-bold mb-2 line-clamp-2">{relatedPost.title}</h4>
                <p className="text-sm text-gray-400 line-clamp-2">{relatedPost.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}