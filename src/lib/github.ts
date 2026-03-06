// GitHub API 服务
const GITHUB_API_BASE = 'https://api.github.com'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  owner: {
    login: string
    avatar_url: string
  }
}

// 缓存机制
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

function getCached(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function searchRepositories(
  query: string,
  language?: string,
  sort: 'stars' | 'updated' | 'forks' = 'stars',
  page: number = 1
): Promise<GitHubRepo[]> {
  const cacheKey = `search:${query}:${language}:${sort}:${page}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  let searchQuery = query
  if (language) {
    searchQuery += ` language:${language}`
  }
  
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=${sort}&order=desc&page=${page}&per_page=30`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          })
        },
        next: { revalidate: 300 } // 5分钟重新验证
      }
    )
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API 速率限制 exceeded. 请稍后再试或配置 GITHUB_TOKEN。')
      }
      if (response.status === 422) {
        throw new Error('搜索参数无效。')
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const data = await response.json()
    setCache(cacheKey, data.items)
    return data.items
  } catch (error: any) {
    console.error('GitHub API error:', error)
    throw error
  }
}

export async function getRepository(owner: string, repo: string): Promise<GitHubRepo> {
  const cacheKey = `repo:${owner}:${repo}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          })
        },
        next: { revalidate: 300 }
      }
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('仓库不存在或无法访问。')
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const data = await response.json()
    setCache(cacheKey, data)
    return data
  } catch (error: any) {
    console.error('GitHub API error:', error)
    throw error
  }
}

export async function getRepositoryContributors(owner: string, repo: string) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          })
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('GitHub API error:', error)
    return []
  }
}

// 计算项目健康度评分
export function calculateHealthScore(repo: GitHubRepo): number {
  const now = new Date()
  const lastPush = new Date(repo.pushed_at)
  const daysSinceLastPush = Math.floor((now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24))
  
  // 活跃度分数 (40%)
  let activityScore = 40
  if (daysSinceLastPush <= 7) activityScore = 40
  else if (daysSinceLastPush <= 30) activityScore = 35
  else if (daysSinceLastPush <= 90) activityScore = 25
  else if (daysSinceLastPush <= 180) activityScore = 15
  else activityScore = Math.max(0, 40 - daysSinceLastPush * 0.1)
  
  // 流行度分数 (30%)
  const popularityScore = Math.min(30, Math.log10(repo.stargazers_count + 1) * 6)
  
  // 维护性分数 (20%)
  const maintenanceScore = repo.open_issues_count > 0 
    ? Math.min(20, 20 * (1 - Math.min(1, repo.open_issues_count / 100)))
    : 20
  
  // 社区分数 (10%)
  const communityScore = Math.min(10, Math.log10(repo.forks_count + 1) * 2)
  
  return Math.round(activityScore + popularityScore + maintenanceScore + communityScore)
}

// 判断项目生命周期阶段
export function determineLifecycle(repo: GitHubRepo): string {
  const now = new Date()
  const createdAt = new Date(repo.created_at)
  const lastPush = new Date(repo.pushed_at)
  const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  const daysSinceLastPush = Math.floor((now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceLastPush > 365) return 'ARCHIVED'
  if (daysSinceLastPush > 180) return 'DECLINING'
  if (ageInDays < 90 && repo.stargazers_count < 100) return 'SEED'
  if (repo.stargazers_count > 10000 && daysSinceLastPush < 7) return 'MATURE'
  return 'GROWING'
}