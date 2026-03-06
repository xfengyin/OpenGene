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

export async function searchRepositories(
  query: string,
  language?: string,
  sort: 'stars' | 'updated' | 'forks' = 'stars',
  page: number = 1
): Promise<GitHubRepo[]> {
  let searchQuery = query
  if (language) {
    searchQuery += ` language:${language}`
  }
  
  const response = await fetch(
    `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=${sort}&order=desc&page=${page}&per_page=30`,
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
  
  const data = await response.json()
  return data.items
}

export async function getRepository(owner: string, repo: string): Promise<GitHubRepo> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
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
}

export async function getRepositoryContributors(owner: string, repo: string) {
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
}

export async function getRepositoryCommits(owner: string, repo: string, since?: string) {
  let url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=100`
  if (since) {
    url += `&since=${since}`
  }
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN && {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      })
    }
  })
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }
  
  return response.json()
}

// 计算项目健康度评分
export function calculateHealthScore(repo: GitHubRepo): number {
  const now = new Date()
  const lastPush = new Date(repo.pushed_at)
  const daysSinceLastPush = Math.floor((now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24))
  
  // 活跃度分数 (40%)
  const activityScore = Math.max(0, 40 - daysSinceLastPush * 0.5)
  
  // 流行度分数 (30%)
  const popularityScore = Math.min(30, Math.log10(repo.stargazers_count + 1) * 6)
  
  // 维护性分数 (20%)
  const maintenanceScore = Math.min(20, (repo.open_issues_count > 0 ? 
    20 * (repo.closed_issues_count || 0) / ((repo.closed_issues_count || 0) + repo.open_issues_count) : 20))
  
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