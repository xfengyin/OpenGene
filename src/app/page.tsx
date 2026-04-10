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
      const response = await fetch('/api/github?q=stars:>1000&language=typescript')
      
      if (!response.ok) {
        throw new Error('Failed to load projects from API')
      }
      
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data)
        setToast({ message: `已加载 ${data.length} 个项目`, type: 'success' })
      } else {
        loadMockProjects()
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
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
    <main className="min-h-screen bg-stripe-white">
      {/* Stripe-style Navigation */}
      <nav className="stripe-nav fixed top-0 w-full z-50">
        <div className="max-w-[1080px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <span className="text-xl font-light tracking-display-xs text-stripe-heading" style={{ fontFeatureSettings: '"ss01" on' }}>
              <span className="stripe-text-gradient font-normal">OpenGene</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="/blog/"
              className="stripe-btn-ghost text-sm py-1.5 px-3"
            >
              📝 博客
            </a>
            <button 
              onClick={() => setActiveView('galaxy')}
              className={`text-sm py-1.5 px-3 rounded-stripe transition cursor-pointer ${
                activeView === 'galaxy' 
                  ? 'stripe-btn-primary' 
                  : 'stripe-btn-ghost'
              }`}
            >
              🌌 星系图谱
            </button>
            <button 
              onClick={() => setActiveView('list')}
              className={`text-sm py-1.5 px-3 rounded-stripe transition cursor-pointer ${
                activeView === 'list' 
                  ? 'stripe-btn-primary' 
                  : 'stripe-btn-ghost'
              }`}
            >
              📋 项目列表
            </button>
            <button 
              onClick={loadProjects}
              disabled={isLoading}
              className="stripe-btn-primary text-sm py-1.5 px-3"
            >
              {isLoading ? '⏳' : '🔄'} 刷新
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 pb-16">
        <ErrorBoundary>
          {isLoading && projects.length === 0 ? (
            <Loading message="正在加载项目数据..." size="lg" />
          ) : activeView === 'galaxy' ? (
            <GalaxyView projects={projects} />
          ) : (
            <div className="max-w-[1080px] mx-auto px-4 py-8">
              <HeroSection />
              <ProjectList projects={projects} />
              <div className="mt-8">
                <AIDiagnostic />
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>

      {/* Stripe-style Footer */}
      <footer className="stripe-dark-section fixed bottom-0 w-full py-2.5">
        <div className="max-w-[1080px] mx-auto px-4 flex justify-center gap-8 text-sm">
          <span className="text-white/60">
            🧬 <span className="tabular-nums text-white font-light">{projects.length}</span> 项目
          </span>
          <span className="text-white/60">
            👥 <span className="text-white font-light">AI</span> 驱动
          </span>
          <span className="text-white/60">
            🔗 <span className="text-white font-light">实时</span> 同步
          </span>
          <span className="text-white/60">
            🤖 <span className="text-white font-light">智能</span> 分析
          </span>
        </div>
      </footer>

      {/* Toast Notification */}
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
