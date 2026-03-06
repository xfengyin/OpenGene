import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/projects - 获取项目列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const language = searchParams.get('language')
  const lifecycle = searchParams.get('lifecycle')
  
  try {
    const where: any = {}
    if (language) where.language = language
    if (lifecycle) where.lifecycle = lifecycle
    
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { healthScore: 'desc' }
      }),
      prisma.project.count({ where })
    ])
    
    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects - 创建新项目
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  try {
    const project = await prisma.project.create({
      data: body
    })
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}