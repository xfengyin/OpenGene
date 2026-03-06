'use client'

import { useEffect, useRef, useState } from 'react'

interface Project {
  id: string
  name: string
  full_name: string
  language: string | null
  stargazers_count: number
  forks_count: number
  healthScore: number
  lifecycle: string
}

interface GalaxyViewProps {
  projects: Project[]
}

export default function GalaxyView({ projects }: GalaxyViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)

  // 生成节点位置
  const generateNodes = (projects: Project[]) => {
    return projects.map((project, index) => {
      const angle = (index / projects.length) * Math.PI * 2
      const radius = 200 + Math.random() * 200
      const x = 400 + Math.cos(angle) * radius
      const y = 300 + Math.sin(angle) * radius
      const size = Math.max(20, Math.min(60, Math.log10(project.stargazers_count + 1) * 10))
      
      // 根据语言分配颜色
      const colors: Record<string, string> = {
        'TypeScript': '#3178C6',
        'JavaScript': '#F7DF1E',
        'Python': '#3776AB',
        'Rust': '#DEA584',
        'Go': '#00ADD8',
        'Java': '#B07219',
        'C++': '#F34B7D',
        'C': '#555555',
        'Ruby': '#701516',
        'Swift': '#FFAC45',
      }
      
      return {
        ...project,
        x,
        y,
        size,
        color: colors[project.language || ''] || '#8B5CF6'
      }
    })
  }

  const nodes = generateNodes(projects)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || projects.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight - 100

    // 绘制星空背景
    const drawStars = () => {
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 1
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`
        ctx.fill()
      }
    }

    // 绘制连线
    const drawConnections = () => {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)'
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.sqrt(
            Math.pow(nodes[i].x - nodes[j].x, 2) +
            Math.pow(nodes[i].y - nodes[j].y, 2)
          )
          if (distance < 250) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // 绘制项目节点
    const drawNodes = () => {
      nodes.forEach((project: any) => {
        const isHovered = hoveredProject?.id === project.id
        const isSelected = selectedProject?.id === project.id

        // 发光效果
        if (isHovered || isSelected) {
          const gradient = ctx.createRadialGradient(
            project.x, project.y, 0,
            project.x, project.y, project.size * 2
          )
          gradient.addColorStop(0, project.color + '60')
          gradient.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(project.x, project.y, project.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // 节点圆
        ctx.beginPath()
        ctx.arc(project.x, project.y, project.size, 0, Math.PI * 2)
        ctx.fillStyle = project.color
        ctx.fill()
        ctx.strokeStyle = isHovered || isSelected ? '#fff' : 'rgba(255,255,255,0.3)'
        ctx.lineWidth = isHovered || isSelected ? 3 : 1
        ctx.stroke()

        // 项目名称
        ctx.fillStyle = '#fff'
        ctx.font = `${isHovered ? 'bold ' : ''}12px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(project.name, project.x, project.y + project.size + 15)
        
        // Stars 数量
        ctx.fillStyle = '#FCD34D'
        ctx.font = '10px sans-serif'
        ctx.fillText(`⭐ ${(project.stargazers_count / 1000).toFixed(1)}k`, project.x, project.y + project.size + 28)
      })
    }

    // 清空并重绘
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawStars()
    drawConnections()
    drawNodes()
  }, [projects, hoveredProject, selectedProject])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hovered = nodes.find((p: any) => {
      const distance = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2))
      return distance < p.size
    })
    setHoveredProject(hovered || null)
  }

  const handleClick = () => {
    if (hoveredProject) {
      setSelectedProject(hoveredProject)
    }
  }

  return (
    <div className="relative w-full h-[calc(100vh-100px)]">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />

      {/* 项目详情面板 */}
      {selectedProject && (
        <div className="absolute right-4 top-20 w-80 bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700 p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{selectedProject.name}</h3>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">语言</span>
              <span style={{ color: '#8B5CF6' }}>● {selectedProject.language || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stars</span>
              <span className="text-yellow-400">⭐ {selectedProject.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Forks</span>
              <span className="text-blue-400">🍴 {selectedProject.forks_count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">健康度</span>
              <span className={`font-bold ${selectedProject.healthScore >= 80 ? 'text-green-400' : selectedProject.healthScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {selectedProject.healthScore}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">生命周期</span>
              <span className="text-blue-400">
                {selectedProject.lifecycle === 'MATURE' ? '🌳' : 
                 selectedProject.lifecycle === 'GROWING' ? '🌿' : 
                 selectedProject.lifecycle === 'SEED' ? '🌱' : 
                 selectedProject.lifecycle === 'DECLINING' ? '🍂' : '💀'} {selectedProject.lifecycle}
              </span>
            </div>
          </div>
          <a 
            href={`https://github.com/${selectedProject.full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition text-center"
          >
            🔗 查看 GitHub
          </a>
          <button className="w-full mt-2 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition">
            🔍 AI 深度诊断
          </button>
        </div>
      )}

      {/* 图例 */}
      <div className="absolute left-4 bottom-4 bg-gray-900/90 backdrop-blur-md rounded-lg p-3 text-sm">
        <div className="text-gray-400 mb-1">节点大小 = Stars 数量</div>
        <div className="text-gray-400">连线 = 相似项目</div>
        <div className="mt-2 flex gap-2 text-xs">
          <span>🌱 Seed</span>
          <span>🌿 Growing</span>
          <span>🌳 Mature</span>
          <span>🍂 Declining</span>
        </div>
      </div>
    </div>
  )
}