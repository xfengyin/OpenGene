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
      const foundPost = mockBlogPosts.find(p => p.slug === slug && p.status === 'published')
      
      if (foundPost) {
        setPost(foundPost)
        
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
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-light tracking-display-md text-stripe-heading mt-8 mb-4" style={{ fontFeatureSettings: '"ss01" on' }}>{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-light tracking-display-sm text-stripe-heading mt-6 mb-3" style={{ fontFeatureSettings: '"ss01" on' }}>{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-light tracking-display-xs text-stripe-heading mt-4 mb-2" style={{ fontFeatureSettings: '"ss01" on' }}>{line.slice(4)}</h3>
        }
        if (line.trim() === '') {
          return <br key={index} />
        }
        return <p key={index} className="mb-4 leading-body-lg text-stripe-label" style={{ fontFeatureSettings: '"ss01" on' }}>{line}</p>
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
          onClick: () => window.location.href = '/blog/'
        }}
      />
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/blog/"
        className="inline-flex items-center gap-2 text-stripe-purple hover:text-stripe-purple-hover transition text-sm mb-6"
        style={{ fontFeatureSettings: '"ss01" on' }}
      >
        ← 返回博客
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="stripe-tag"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 
          className="text-4xl md:text-5xl font-light tracking-display-lg leading-display-lg text-stripe-heading mb-4"
          style={{ fontFeatureSettings: '"ss01" on' }}
        >
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-stripe-body leading-body-lg mb-6" style={{ fontFeatureSettings: '"ss01" on' }}>{post.excerpt}</p>

        {/* Author Info */}
        <div className="flex items-center justify-between py-4 border-y border-stripe-border">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-normal text-stripe-heading" style={{ fontFeatureSettings: '"ss01" on' }}>{post.author.name}</div>
              <div className="text-sm text-stripe-body" style={{ fontFeatureSettings: '"ss01" on' }}>
                发布于 {formatDate(post.publishedAt)}
                {post.updatedAt !== post.publishedAt && (
                  <> · 更新于 {formatDate(post.updatedAt)}</>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-stripe-body text-sm tabular-nums" style={{ fontFeatureSettings: '"tnum" on, "ss01" on' }}>
            <span>👁 {post.views.toLocaleString()}</span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition ${
                liked ? 'text-stripe-ruby' : 'hover:text-stripe-ruby'
              }`}
            >
              {liked ? '❤️' : '🤍'} {post.likes + (liked ? 1 : 0)}
            </button>
            <span>💬 {post.comments}</span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8 rounded-stripe-xl overflow-hidden shadow-stripe-card">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose max-w-none">
        {renderContent(post.content)}
      </div>

      {/* Share Buttons */}
      <div className="mt-12 pt-8 border-t border-stripe-border">
        <div className="flex items-center justify-between">
          <div className="text-stripe-body text-sm" style={{ fontFeatureSettings: '"ss01" on' }}>分享这篇文章：</div>
          <div className="flex gap-3">
            <button
              onClick={() => navigator.share?.({
                title: post.title,
                url: window.location.href
              })}
              className="stripe-btn-ghost text-sm py-1.5 px-3"
            >
              🔗 分享
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="stripe-btn-primary text-sm py-1.5 px-3"
            >
              🐦 Twitter
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-stripe-border">
          <h3 
            className="text-2xl font-light tracking-display-sm text-stripe-heading mb-6"
            style={{ fontFeatureSettings: '"ss01" on' }}
          >
            相关文章
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPosts.map(relatedPost => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}/`}
                className="stripe-card p-4"
              >
                <h4 
                  className="font-light text-stripe-heading mb-2 line-clamp-2"
                  style={{ fontFeatureSettings: '"ss01" on' }}
                >
                  {relatedPost.title}
                </h4>
                <p className="text-sm text-stripe-body line-clamp-2" style={{ fontFeatureSettings: '"ss01" on' }}>{relatedPost.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
