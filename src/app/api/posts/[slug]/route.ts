import { NextRequest, NextResponse } from 'next/server'
import { mockBlogPosts } from '@/types/blog'

// GET /api/posts/[slug] - 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  
  try {
    const post = mockBlogPosts.find(p => p.slug === slug && p.status === 'published')
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    // 增加浏览量
    post.views++
    
    // 获取相关文章
    const relatedPosts = mockBlogPosts
      .filter(p => 
        p.id !== post.id && 
        p.status === 'published' &&
        (p.category === post.category || p.tags.some(t => post.tags.includes(t)))
      )
      .slice(0, 3)
    
    return NextResponse.json({ post, relatedPosts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}