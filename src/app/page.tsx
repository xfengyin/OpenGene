'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/HeroSection'
import GalaxyView from '@/components/galaxy/GalaxyView'
import ProjectList from '@/components/project/ProjectList'
import AIDiagnostic from '@/components/project/AIDiagnostic'
import { ErrorBoundary, Loading, Toast } from '@/components/ui/Feedback'
import { useAppStore } from '@/lib/store'

export default function Home() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  
  const {
    projects,
    isLoading,
    error,
    activeView,
    setProjects,
    setLoading,
    setError,
    setActiveView,
    clearError
  } = useAppStore()

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' })
      clearError()
    }
  }, [error, clearError])

  const loadProjects = async () => {
    setLoading(true)
    try {
      // 尝试从 API 加载
      const response = await fetch('/api/github?q=stars:>1000&language=typescript')
      
      if (!response.ok) {
        throw new Error('Failed to load projects from API')
      }
      
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data)
        setToast({ message: `已加载 ${data.length} 个项目`, type: 'success' })
      } else {
        // 如果 API 返回空数据，使用模拟数据
        loadMockProjects()
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
      // 使用模拟数据
      loadMockProjects()
    } finally {
      setLoading(false)
    }
  }

  const loadMockProjects = () => {
    const mockProjects = [
      {
        id: '1',
        name: 'react',
        full_name: 'facebook/react',
        description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
        language: 'TypeScript',
        stargazers_count: 218000,
        forks_count: 46000,
        healthScore: 95,
        lifecycle: 'MATURE'
      },
      {
        id: '2',
        name: 'vue',
        full_name: 'vuejs/vue',
        description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework.',
        language: 'TypeScript',
        stargazers_count: 205000,
        forks_count: 34000,
        healthScore: 92,
        lifecycle: 'MATURE'
      },
      {
        id: '3',
        name: 'next.js',
        full_name: 'vercel/next.js',
        description: 'The React Framework for Production',
        language: 'TypeScript',
        stargazers_count: 115000,
        forks_count: 25000,
        healthScore: 94,
        lifecycle: 'GROWING'
      },
      {
        id: '4',
        name: 'rust',
        full_name: 'rust-lang/rust',
        description: 'A language empowering everyone to build reliable and efficient software.',
        language: 'Rust',
        stargazers_count: 88000,
        forks_count: 12000,
        healthScore: 96,
        lifecycle: 'MATURE'
      },
      {
        id: '5',
        name: 'go',
        full_name: 'golang/go',
        description: 'The Go programming language',
        language: 'Go',
        stargazers_count: 115000,
        forks_count: 17000,
        healthScore: 95,
        lifecycle: 'MATURE'
      }
    ]
    
    setProjects(mockProjects)
    setToast({ message: `已加载 ${mockProjects.length} 个示例项目`, type: 'info' })
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* 导航栏 */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              OpenGene
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveView('galaxy')}
              className={`px-4 py-2 rounded-lg transition ${activeView === 'galaxy' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              🌌 星系图谱
            </button>
            <button 
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 rounded-lg transition ${activeView === 'list' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              📋 项目列表
            </button>
            <button 
              onClick={loadProjects}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 rounded-lg transition"
            >
              {isLoading ? '⏳' : '🔄'} 刷新
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="pt-16 pb-16">
        <ErrorBoundary>
          {isLoading && projects.length === 0 ? (
            <Loading message="正在加载项目数据..." size="lg" />
          ) : activeView === 'galaxy' ? (
            <GalaxyView projects={projects} />
          ) : (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <HeroSection />
              <ProjectList projects={projects} />
              <div className="mt-8">
                <AIDiagnostic />
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>

      {/* 底部统计 */}
      <footer className="fixed bottom-0 w-full bg-gray-950/90 backdrop-blur-md border-t border-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 text-sm text-gray-400">
          <span>🧬 <span className="text-purple-400 font-bold">{projects.length}</span> 项目</span>
          <span>👥 <span className="text-green-400 font-bold">AI</span> 驱动</span>
          <span>🔗 <span className="text-blue-400 font-bold">实时</span> 同步</span>
          <span>🤖 <span className="text-pink-400 font-bold">智能</span> 分析</span>
        </div>
      </footer>

      {/* Toast 通知 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  )
}