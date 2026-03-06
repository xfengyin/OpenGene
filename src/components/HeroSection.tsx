'use client'

export default function HeroSection() {
  return (
    <section className="py-12 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          开源项目生态图谱
        </span>
      </h1>
      <p className="text-xl text-gray-400 mb-8">
        AI 驱动的项目发现、分析和学习平台
      </p>
      
      {/* 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 card-hover">
          <div className="text-3xl mb-2">🌌</div>
          <h3 className="font-bold text-lg mb-1">星系图谱</h3>
          <p className="text-sm text-gray-400">3D 可视化项目生态</p>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 card-hover">
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="font-bold text-lg mb-1">AI 诊断</h3>
          <p className="text-sm text-gray-400">深度分析项目健康度</p>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 card-hover">
          <div className="text-3xl mb-2">🏆</div>
          <h3 className="font-bold text-lg mb-1">贡献者荣耀</h3>
          <p className="text-sm text-gray-400">段位制成长体系</p>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 card-hover">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-bold text-lg mb-1">生命周期</h3>
          <p className="text-sm text-gray-400">追踪项目演化历程</p>
        </div>
      </div>
    </section>
  )
}