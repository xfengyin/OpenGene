import { NextRequest, NextResponse } from 'next/server'
import { analyzeProject, generateLearningPath } from '@/lib/ai'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { 
    repoName, 
    description, 
    language, 
    stars, 
    forks, 
    issues, 
    recentCommits 
  } = body
  
  if (!repoName) {
    return NextResponse.json({ error: 'Repository name required' }, { status: 400 })
  }
  
  try {
    const analysis = await analyzeProject(
      repoName,
      description || '',
      language || 'Unknown',
      stars || 0,
      forks || 0,
      issues || 0,
      recentCommits || 0
    )
    
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze project' }, { status: 500 })
  }
}

// 生成学习路径
export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { goal, currentSkills, targetLevel } = body
  
  if (!goal) {
    return NextResponse.json({ error: 'Goal required' }, { status: 400 })
  }
  
  try {
    const path = await generateLearningPath(
      goal,
      currentSkills || [],
      targetLevel || 'intermediate'
    )
    
    return NextResponse.json({ learningPath: path })
  } catch (error) {
    console.error('Learning path error:', error)
    return NextResponse.json({ error: 'Failed to generate learning path' }, { status: 500 })
  }
}