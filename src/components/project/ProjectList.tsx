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

  const getHealthBadge = (score: number) => {
    if (score >= 80) return 'stripe-badge-success'
    if (score >= 60) return 'bg-yellow-50 text-stripe-lemon border border-yellow-200'
    return 'bg-red-50 text-stripe-ruby border border-red-200'
  }

  return (
    <section className="mt-8">
      {/* Search & Filters - Stripe input style */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="搜索项目..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="stripe-input flex-1 min-w-[200px]"
        />
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="stripe-input min-w-[120px]"
        >
          <option value="all">所有语言</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <select
          value={selectedLifecycle}
          onChange={(e) => setSelectedLifecycle(e.target.value)}
          className="stripe-input min-w-[120px]"
        >
          <option value="all">所有阶段</option>
          <option value="SEED">🌱 萌芽期</option>
          <option value="GROWING">🌿 成长期</option>
          <option value="MATURE">🌳 成熟期</option>
          <option value="DECLINING">🍂 衰退期</option>
        </select>
      </div>

      {/* Project Cards */}
      <div className="grid gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="stripe-card p-5 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 
                    className="font-light text-lg tracking-display-xs text-stripe-purple hover:underline"
                    style={{ fontFeatureSettings: '"ss01" on' }}
                  >
                    {project.name}
                  </h3>
                  <span className="text-lg" title={project.lifecycle}>
                    {getLifecycleIcon(project.lifecycle)}
                  </span>
                </div>
                <p className="text-stripe-body text-sm mt-1.5 line-clamp-2 leading-body" style={{ fontFeatureSettings: '"ss01" on' }}>
                  {project.description || 'No description'}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  {project.language && (
                    <span className="flex items-center gap-1.5 text-stripe-label" style={{ fontFeatureSettings: '"ss01" on' }}>
                      <span className="w-2.5 h-2.5 rounded-full bg-stripe-purple"></span>
                      {project.language}
                    </span>
                  )}
                  <span className="tabular-nums text-stripe-label" style={{ fontFeatureSettings: '"tnum" on, "ss01" on' }}>
                    ⭐ {project.stargazers_count.toLocaleString()}
                  </span>
                  <span className="tabular-nums text-stripe-body" style={{ fontFeatureSettings: '"tnum" on, "ss01" on' }}>
                    🍴 {project.forks_count.toLocaleString()}
                  </span>
                  <span className={`stripe-badge ${getHealthBadge(project.healthScore)}`}>
                    💚 {project.healthScore}%
                  </span>
                </div>
              </div>
              
              <a
                href={`https://github.com/${project.full_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="stripe-btn-ghost text-sm py-1.5 px-3"
              >
                查看
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 
            className="text-xl font-light text-stripe-heading mb-2"
            style={{ fontFeatureSettings: '"ss01" on' }}
          >
            没有找到匹配的项目
          </h3>
          <p className="text-stripe-body" style={{ fontFeatureSettings: '"ss01" on' }}>尝试调整筛选条件</p>
        </div>
      )}
    </section>
  )
}
