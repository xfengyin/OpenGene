'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlogPost, blogCategories } from '@/types/blog'
import { Loading, EmptyState } from '@/components/ui/Feedback'

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [selectedCategory, page])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(page))
      params.append('limit', '10')
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()
      
      if (page === 1) {
        setPosts(data.posts)
      } else {
        setPosts(prev => [...prev, ...data.posts])
      }
      
      setHasMore(data.posts.length === 10)
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            📝 开源博客
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          发现开源世界的故事、教程和洞见。从 AI 驱动的项目分析到技术趋势解读，
          探索开源生态的无限可能。
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => {
            setSelectedCategory('all')
            setPage(1)
          }}
          className={`px-4 py-2 rounded-full transition ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          全部
        </button>
        {blogCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id)
              setPage(1)
            }}
            className={`px-4 py-2 rounded-full transition flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 文章列表 */}
      {loading && posts.length === 0 ? (
        <Loading message="加载文章中..." />
      ) : posts.length === 0 ? (
        <EmptyState
          icon="📝"
          title="暂无文章"
          description="该分类下还没有文章，去看看其他分类吧"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <article
              key={post.id}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden card-hover"
            >
              {/* 封面图 */}
              {post.coverImage && (
                <div className="h-48 bg-gray-800 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              )}
              
              {/* 内容 */}
              <div className="p-6">
                {/* 分类标签 */}
                <div className="flex items-center gap-2 mb-3">
                  {(() => {
                    const cat = blogCategories.find(c => c.id === post.category)
                    return cat ? (
                      <span className="text-sm text-purple-400">
                        {cat.icon} {cat.name}
                      </span>
                    ) : null
                  })()}
                  {post.featured && (
                    <span className="text-xs bg-yellow-600/30 text-yellow-400 px-2 py-1 rounded">
                      精选
                    </span>
                  )}
                </div>
                
                {/* 标题 */}
                <h2 className="text-xl font-bold mb-2 line-clamp-2 hover:text-purple-400 transition">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                {/* 摘要 */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* 作者和统计 */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>👁 {post.views.toLocaleString()}</span>
                    <span>❤️ {post.likes}</span>
                  </div>
                </div>
                
                {/* 发布时间 */}
                <div className="mt-3 text-xs text-gray-600">
                  {formatDate(post.publishedAt)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 加载更多 */}
      {hasMore && posts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
          >
            {loading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </div>
  )
}