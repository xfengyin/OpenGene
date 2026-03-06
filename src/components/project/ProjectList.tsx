'use client'

import { useState } from 'react'

const mockProjects = [
  { id: '1', name: 'react', fullName: 'facebook/react', description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.', language: 'TypeScript', stars: 218000, forks: 46000, healthScore: 92 },
  { id: '2', name: 'vue', fullName: 'vuejs/vue', description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.', language: 'TypeScript', stars: 205000, forks: 34000, healthScore: 89 },
  { id: '3', name: 'next.js', fullName: 'vercel/next.js', description: 'The React Framework for Production', language: 'JavaScript', stars: 115000, forks: 25000, healthScore: 94 },
  { id: '4', name: 'rust', fullName: 'rust-lang/rust', description: 'A language empowering everyone to build reliable and efficient software.', language: 'Rust', stars: 88000, forks: 12000, healthScore: 96 },
  { id: '5', name: 'go', fullName: 'golang/go', description: 'The Go programming language', language: 'Go', stars: 115000, forks: 17000, healthScore: 95 },
]

export default function ProjectList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')

  const filteredProjects = mockProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedLanguage === 'all' || p.language === selectedLanguage)
  )

  return (
    <section className="mt-8">
      {/* 搜索和筛选 */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索项目..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
        />
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
        >
          <option value="all">所有语言</option>
          <option value="TypeScript">TypeScript</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Rust">Rust</option>
          <option value="Go">Go</option>
          <option value="Python">Python</option>
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
                <h3 className="font-bold text-lg text-blue-400 hover:underline">
                  {project.fullName}
                </h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    {project.language}
                  </span>
                  <span className="text-yellow-400">⭐ {project.stars.toLocaleString()}</span>
                  <span className="text-gray-400">🍴 {project.forks.toLocaleString()}</span>
                </div>
              </div>
              
              {/* 健康度评分 */}
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  project.healthScore >= 90 ? 'text-green-400' :
                  project.healthScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {project.healthScore}
                </div>
                <div className="text-xs text-gray-400">健康度</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}