import { NextRequest, NextResponse } from 'next/server'
import { searchRepositories, getRepository, calculateHealthScore, determineLifecycle } from '@/lib/github'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const language = searchParams.get('language') || undefined
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }
  
  try {
    const repos = await searchRepositories(query, language)
    
    // 增强数据
    const enhancedRepos = repos.map(repo => ({
      ...repo,
      healthScore: calculateHealthScore(repo),
      lifecycle: determineLifecycle(repo)
    }))
    
    return NextResponse.json(enhancedRepos)
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { owner, repo } = body
  
  if (!owner || !repo) {
    return NextResponse.json({ error: 'Owner and repo required' }, { status: 400 })
  }
  
  try {
    const repository = await getRepository(owner, repo)
    const healthScore = calculateHealthScore(repository)
    const lifecycle = determineLifecycle(repository)
    
    return NextResponse.json({
      ...repository,
      healthScore,
      lifecycle
    })
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json({ error: 'Failed to fetch repository' }, { status: 500 })
  }
}