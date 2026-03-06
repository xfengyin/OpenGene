// 类型定义
export interface Project {
  id: string
  githubId: string
  name: string
  fullName: string
  description: string | null
  url: string
  language: string | null
  stars: number
  forks: number
  healthScore: number
  lifecycle: LifecycleStage
  aiSummary: string | null
  createdAt: Date
  updatedAt: Date
}

export type LifecycleStage = 'SEED' | 'GROWING' | 'MATURE' | 'DECLINING' | 'ARCHIVED'

export interface Contributor {
  id: string
  githubId: string
  username: string
  avatarUrl: string | null
  rank: Rank
  points: number
}

export type Rank = 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND' | 'MASTER' | 'LEGEND'

export interface HealthReport {
  score: number
  activity: number
  popularity: number
  maintenance: number
  community: number
  recommendation: string
}

export interface GalaxyNode {
  id: string
  name: string
  size: number
  color: string
  x: number
  y: number
  z: number
}