import { NextRequest, NextResponse } from 'next/server'
import { mockBlogPosts } from '@/types/blog'

// GET /api/posts - 获取文章列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')
  const featured = searchParams.get('featured')
  
  try {
    let posts = [...mockBlogPosts]
    
    // 筛选
    if (category) {
      posts = posts.filter(p => p.category === category)
    }
    if (tag) {
      posts = posts.filter(p => p.tags.includes(tag))
    }
    if (featured === 'true') {
      posts = posts.filter(p => p.featured)
    }
    
    // 只返回已发布的文章
    posts = posts.filter(p => p.status === 'published')
    
    // 排序：精选优先，然后按发布时间
    posts.sort((a, b) => {
      if (a.featured !== b.featured) return b.featured ? 1 : -1
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
    
    const total = posts.length
    const paginatedPosts = posts.slice((page - 1) * limit, page * limit)
    
    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST /api/posts - 创建新文章（需要认证）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证必填字段
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }
    
    // 生成 slug
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100)
    
    const newPost = {
      id: String(Date.now()),
      slug,
      excerpt: body.content.substring(0, 200) + '...',
      views: 0,
      likes: 0,
      comments: 0,
      publishedAt: new Date(),
      updatedAt: new Date(),
      status: 'published',
      ...body
    }
    
    // 这里应该保存到数据库
    mockBlogPosts.unshift(newPost)
    
    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}