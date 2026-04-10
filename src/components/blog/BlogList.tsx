'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlogPost, blogCategories, mockBlogPosts } from '@/types/blog'
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

  const loadPosts = () => {
    setLoading(true)
    try {
      let filteredPosts = mockBlogPosts.filter(p => p.status === 'published')
      
      if (selectedCategory !== 'all') {
        filteredPosts = filteredPosts.filter(p => p.category === selectedCategory)
      }
      
      filteredPosts = filteredPosts.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      
      const limit = 10
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedPosts = filteredPosts.slice(start, end)
      
      if (page === 1) {
        setPosts(paginatedPosts)
      } else {
        setPosts(prev => [...prev, ...paginatedPosts])
      }
      
      setHasMore(paginatedPosts.length === limit)
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
    <div className="max-w-[1080px] mx-auto px-4 py-8">
      {/* Page Title - Stripe style */}
      <div className="text-center mb-12">
        <h1 
          className="text-5xl font-light tracking-display-lg leading-display-lg text-stripe-heading mb-4"
          style={{ fontFeatureSettings: '"ss01" on' }}
        >
          <span className="stripe-text-gradient">开源博客</span>
        </h1>
        <p className="text-stripe-body max-w-2xl mx-auto leading-body-lg" style={{ fontFeatureSettings: '"ss01" on' }}>
          发现开源世界的故事、教程和洞见。从 AI 驱动的项目分析到技术趋势解读，
          探索开源生态的无限可能。
        </p>
      </div>

      {/* Category Filter - Stripe ghost buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => {
            setSelectedCategory('all')
            setPage(1)
          }}
          className={`px-4 py-2 rounded-stripe text-sm transition cursor-pointer ${
            selectedCategory === 'all'
              ? 'stripe-btn-primary'
              : 'stripe-btn-ghost'
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
            className={`px-4 py-2 rounded-stripe text-sm transition cursor-pointer flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'stripe-btn-primary'
                : 'stripe-btn-ghost'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Blog Cards */}
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
              className="stripe-card overflow-hidden"
            >
              {/* Cover Image */}
              {post.coverImage && (
                <div className="h-48 bg-stripe-border/30 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                {/* Category Tag */}
                <div className="flex items-center gap-2 mb-3">
                  {(() => {
                    const cat = blogCategories.find(c => c.id === post.category)
                    return cat ? (
                      <span className="stripe-badge stripe-badge-purple">
                        {cat.icon} {cat.name}
                      </span>
                    ) : null
                  })()}
                  {post.featured && (
                    <span className="stripe-badge bg-yellow-50 text-stripe-lemon border border-yellow-200">
                      精选
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h2 
                  className="font-light text-xl tracking-display-xs leading-display-xs text-stripe-heading mb-2 line-clamp-2 hover:text-stripe-purple transition"
                  style={{ fontFeatureSettings: '"ss01" on' }}
                >
                  <Link href={`/blog/${post.slug}/`}>
                    {post.title}
                  </Link>
                </h2>
                
                {/* Excerpt */}
                <p className="text-stripe-body text-sm mb-4 line-clamp-2 leading-body" style={{ fontFeatureSettings: '"ss01" on' }}>
                  {post.excerpt}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="stripe-tag"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Author and Stats */}
                <div className="flex items-center justify-between text-sm text-stripe-body">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span style={{ fontFeatureSettings: '"ss01" on' }}>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-3 tabular-nums" style={{ fontFeatureSettings: '"tnum" on, "ss01" on' }}>
                    <span>👁 {post.views.toLocaleString()}</span>
                    <span>❤️ {post.likes}</span>
                  </div>
                </div>
                
                {/* Publish Date */}
                <div className="mt-3 text-xs text-stripe-body/60" style={{ fontFeatureSettings: '"ss01" on' }}>
                  {formatDate(post.publishedAt)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && posts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
            className="stripe-btn-ghost disabled:opacity-50"
          >
            {loading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </div>
  )
}
