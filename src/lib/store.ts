import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Project {
  id: string
  name: string
  full_name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  healthScore: number
  lifecycle: string
}

interface AppState {
  // 项目数据
  projects: Project[]
  selectedProject: Project | null
  isLoading: boolean
  error: string | null
  
  // 搜索和筛选
  searchQuery: string
  selectedLanguage: string
  selectedLifecycle: string
  
  // 视图状态
  activeView: 'galaxy' | 'list'
  
  // 用户偏好
  favorites: string[]
  recentSearches: string[]
  
  // Actions
  setProjects: (projects: Project[]) => void
  setSelectedProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setSelectedLanguage: (language: string) => void
  setSelectedLifecycle: (lifecycle: string) => void
  setActiveView: (view: 'galaxy' | 'list') => void
  addFavorite: (projectId: string) => void
  removeFavorite: (projectId: string) => void
  addRecentSearch: (query: string) => void
  clearError: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      projects: [],
      selectedProject: null,
      isLoading: false,
      error: null,
      
      searchQuery: '',
      selectedLanguage: 'all',
      selectedLifecycle: 'all',
      
      activeView: 'galaxy',
      
      favorites: [],
      recentSearches: [],
      
      // Actions
      setProjects: (projects) => set({ projects }),
      
      setSelectedProject: (project) => set({ selectedProject: project }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      
      setSelectedLifecycle: (lifecycle) => set({ selectedLifecycle: lifecycle }),
      
      setActiveView: (view) => set({ activeView: view }),
      
      addFavorite: (projectId) => {
        const { favorites } = get()
        if (!favorites.includes(projectId)) {
          set({ favorites: [...favorites, projectId] })
        }
      },
      
      removeFavorite: (projectId) => {
        const { favorites } = get()
        set({ favorites: favorites.filter(id => id !== projectId) })
      },
      
      addRecentSearch: (query) => {
        if (!query.trim()) return
        const { recentSearches } = get()
        const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 10)
        set({ recentSearches: updated })
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'opengene-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        recentSearches: state.recentSearches,
        selectedLanguage: state.selectedLanguage,
        activeView: state.activeView
      })
    }
  )
)

// 派生状态 hooks
export const useFilteredProjects = () => {
  const { projects, searchQuery, selectedLanguage, selectedLifecycle } = useAppStore()
  
  return projects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLanguage = selectedLanguage === 'all' || project.language === selectedLanguage
    const matchesLifecycle = selectedLifecycle === 'all' || project.lifecycle === selectedLifecycle
    
    return matchesSearch && matchesLanguage && matchesLifecycle
  })
}

export const useLanguages = () => {
  const { projects } = useAppStore()
  const languages = new Set(projects.map(p => p.language).filter(Boolean))
  return Array.from(languages).sort()
}

export const useProjectStats = () => {
  const { projects } = useAppStore()
  
  return {
    total: projects.length,
    byLanguage: projects.reduce((acc, p) => {
      const lang = p.language || 'Unknown'
      acc[lang] = (acc[lang] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    byLifecycle: projects.reduce((acc, p) => {
      acc[p.lifecycle] = (acc[p.lifecycle] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    avgHealth: projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.healthScore, 0) / projects.length)
      : 0
  }
}