'use client'

import { useEffect, useRef, useState } from 'react'

interface Node {
  id: string
  name: string
  x: number
  y: number
  size: number
  color: string
}

const mockProjects: Node[] = [
  { id: '1', name: 'React', x: 400, y: 300, size: 40, color: '#61DAFB' },
  { id: '2', name: 'Vue', x: 200, y: 200, size: 35, color: '#42B883' },
  { id: '3', name: 'Next.js', x: 600, y: 250, size: 38, color: '#000000' },
  { id: '4', name: 'TypeScript', x: 300, y: 400, size: 45, color: '#3178C6' },
  { id: '5', name: 'Rust', x: 500, y: 450, size: 32, color: '#DEA584' },
  { id: '6', name: 'Go', x: 150, y: 350, size: 30, color: '#00ADD8' },
  { id: '7', name: 'Python', x: 700, y: 350, size: 42, color: '#3776AB' },
  { id: '8', name: 'Flutter', x: 250, y: 150, size: 28, color: '#02569B' },
]

export default function GalaxyView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedProject, setSelectedProject] = useState<Node | null>(null)
  const [hoveredProject, setHoveredProject] = useState<Node | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'
      ctx.lineWidth = 1
      for (let i = 0; i < mockProjects.length; i++) {
        for (let j = i + 1; j < mockProjects.length; j++) {
          const distance = Math.sqrt(
            Math.pow(mockProjects[i].x - mockProjects[j].x, 2) +
            Math.pow(mockProjects[i].y - mockProjects[j].y, 2)
          )
          if (distance < 300) {
            ctx.beginPath()
            ctx.moveTo(mockProjects[i].x, mockProjects[i].y)
            ctx.lineTo(mockProjects[j].x, mockProjects[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // 绘制项目节点
    const drawNodes = () => {
      mockProjects.forEach((project) => {
        const isHovered = hoveredProject?.id === project.id
        const isSelected = selectedProject?.id === project.id

        // 发光效果
        if (isHovered || isSelected) {
          const gradient = ctx.createRadialGradient(
            project.x, project.y, 0,
            project.x, project.y, project.size * 2
          )
          gradient.addColorStop(0, project.color + '80')
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
        ctx.font = `${isHovered ? 'bold ' : ''}14px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(project.name, project.x, project.y + project.size + 20)
      })
    }

    // 清空并重绘
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawStars()
    drawConnections()
    drawNodes()
  }, [hoveredProject, selectedProject])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hovered = mockProjects.find(p => {
      const distance = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2))
      return distance < p.size
    })
    setHoveredProject(hovered || null)
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
              <span style={{ color: selectedProject.color }}>● {selectedProject.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">影响力</span>
              <span className="text-purple-400">{Math.round(selectedProject.size * 100)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">健康度</span>
              <span className="text-green-400">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">生命周期</span>
              <span className="text-blue-400">🌳 成熟期</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition">
            🔍 AI 深度诊断
          </button>
        </div>
      )}

      {/* 图例 */}
      <div className="absolute left-4 bottom-4 bg-gray-900/90 backdrop-blur-md rounded-lg p-3 text-sm">
        <div className="text-gray-400 mb-2">节点大小 = 影响力</div>
        <div className="text-gray-400">连线 = 依赖关系</div>
      </div>
    </div>
  )
}