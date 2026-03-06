'use client'

import { useState } from 'react'
import HeroSection from '@/components/HeroSection'
import GalaxyView from '@/components/galaxy/GalaxyView'
import ProjectList from '@/components/project/ProjectList'
import AIDiagnostic from '@/components/project/AIDiagnostic'

export default function Home() {
  const [activeView, setActiveView] = useState<'galaxy' | 'list'>('galaxy')

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
            <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition">
              🔍 AI 诊断
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="pt-16">
        {activeView === 'galaxy' ? (
          <GalaxyView />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <HeroSection />
            <ProjectList />
          </div>
        )}
      </div>

      {/* 底部统计 */}
      <footer className="fixed bottom-0 w-full bg-gray-950/90 backdrop-blur-md border-t border-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 text-sm text-gray-400">
          <span>🧬 <span className="text-purple-400 font-bold">1,234</span> 项目</span>
          <span>👥 <span className="text-green-400 font-bold">5,678</span> 贡献者</span>
          <span>🔗 <span className="text-blue-400 font-bold">12,345</span> 依赖关系</span>
          <span>🤖 <span className="text-pink-400 font-bold">AI</span> 驱动分析</span>
        </div>
      </footer>
    </main>
  )
}