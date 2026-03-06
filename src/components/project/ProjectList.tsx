'use client'

import { useState } from 'react'

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

interface ProjectListProps {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedLifecycle, setSelectedLifecycle] = useState('all')

  // 获取所有语言
  const languages = Array.from(new Set(projects.map(p => p.language).filter((lang): lang is string => lang !== null)))

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLanguage = selectedLanguage === 'all' || p.language === selectedLanguage
    const matchesLifecycle = selectedLifecycle === 'all' || p.lifecycle === selectedLifecycle
    return matchesSearch && matchesLanguage && matchesLifecycle
  })

  const getLifecycleIcon = (lifecycle: string) => {
    switch (lifecycle) {
      case 'SEED': return '🌱'
      case 'GROWING': return '🌿'
      case 'MATURE': return '🌳'
      case 'DECLINING': return '🍂'
      case 'ARCHIVED': return '💀'
      default: return '🌱'
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <section className="mt-8">
      {/* 搜索和筛选 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索项目..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
        />
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
        >
          <option value="all">所有语言</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <select
          value={selectedLifecycle}
          onChange={(e) => setSelectedLifecycle(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
        >
          <option value="all">所有阶段</option>
          <option value="SEED">🌱 萌芽期</option>
          <option value="GROWING">🌿 成长期</option>
          <option value="MATURE">🌳 成熟期</option>
          <option value="DECLINING">🍂 衰退期</option>
        </select>
      </div>

      {/* 项目列表 */}
      <div className="grid gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 card-hover cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-blue-400 hover:underline">
                    {project.name}
                  </h3>
                  <span className="text-lg" title={project.lifecycle}>
                    {getLifecycleIcon(project.lifecycle)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  {project.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                      {project.language}
                    </span>
                  )}
                  <span className="text-yellow-400">⭐ {project.stargazers_count.toLocaleString()}</span>
                  <span className="text-gray-400">🍴 {project.forks_count.toLocaleString()}</span>
                  <span className={`font-bold ${getHealthColor(project.healthScore)}`}>
                    💚 {project.healthScore}%
                  </span>
                </div>
              </div>
              
              <a
                href={`https://github.com/${project.full_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
              >
                查看
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl">😕 没有找到匹配的项目</p>
          <p className="mt-2">尝试调整筛选条件</p>
        </div>
      )}
    </section>
  )
}