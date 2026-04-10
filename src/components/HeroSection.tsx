'use client'

export default function HeroSection() {
  return (
    <section className="py-16 text-center">
      {/* Hero Title - Stripe weight-300, negative tracking */}
      <h1 
        className="text-5xl md:text-7xl font-light tracking-display-xl leading-display-xl text-stripe-heading mb-6"
        style={{ fontFeatureSettings: '"ss01" on' }}
      >
        <span className="stripe-text-gradient">开源项目</span>
        <br />
        <span>生态图谱</span>
      </h1>
      <p className="text-lg leading-body-lg text-stripe-body max-w-2xl mx-auto mb-10" style={{ fontFeatureSettings: '"ss01" on' }}>
        AI 驱动的项目发现、分析和学习平台
      </p>
      
      {/* CTA Buttons - Stripe style */}
      <div className="flex items-center justify-center gap-4 mb-16">
        <button className="stripe-btn-primary text-base py-3 px-6">
          开始探索
        </button>
        <button className="stripe-btn-ghost text-base py-3 px-6">
          了解更多
        </button>
      </div>

      {/* Feature Cards - Stripe card style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">
        <div className="stripe-card p-6">
          <div className="w-10 h-10 rounded-stripe-lg stripe-gradient-brand flex items-center justify-center text-white text-lg mb-4">
            🌌
          </div>
          <h3 
            className="font-light text-lg tracking-display-xs leading-display-xs text-stripe-heading mb-2"
            style={{ fontFeatureSettings: '"ss01" on' }}
          >
            星系图谱
          </h3>
          <p className="text-sm text-stripe-body leading-body" style={{ fontFeatureSettings: '"ss01" on' }}>
            3D 可视化项目生态
          </p>
        </div>
        <div className="stripe-card p-6">
          <div className="w-10 h-10 rounded-stripe-lg stripe-gradient-hero flex items-center justify-center text-white text-lg mb-4">
            🤖
          </div>
          <h3 
            className="font-light text-lg tracking-display-xs leading-display-xs text-stripe-heading mb-2"
            style={{ fontFeatureSettings: '"ss01" on' }}
          >
            AI 诊断
          </h3>
          <p className="text-sm text-stripe-body leading-body" style={{ fontFeatureSettings: '"ss01" on' }}>
            深度分析项目健康度
          </p>
        </div>
        <div className="stripe-card p-6">
          <div className="w-10 h-10 rounded-stripe-lg bg-stripe-success/20 flex items-center justify-center text-lg mb-4">
            🏆
          </div>
          <h3 
            className="font-light text-lg tracking-display-xs leading-display-xs text-stripe-heading mb-2"
            style={{ fontFeatureSettings: '"ss01" on' }}
          >
            贡献者荣耀
          </h3>
          <p className="text-sm text-stripe-body leading-body" style={{ fontFeatureSettings: '"ss01" on' }}>
            段位制成长体系
          </p>
        </div>
        <div className="stripe-card p-6">
          <div className="w-10 h-10 rounded-stripe-lg bg-stripe-purple/10 flex items-center justify-center text-lg mb-4">
            📊
          </div>
          <h3 
            className="font-light text-lg tracking-display-xs leading-display-xs text-stripe-heading mb-2"
            style={{ fontFeatureSettings: '"ss01" on' }}
          >
            生命周期
          </h3>
          <p className="text-sm text-stripe-body leading-body" style={{ fontFeatureSettings: '"ss01" on' }}>
            追踪项目演化历程
          </p>
        </div>
      </div>

      {/* Dark brand section - Stripe #1c1e54 */}
      <div className="stripe-dark-section mt-20 -mx-4 px-8 py-16 rounded-none">
        <h2 
          className="text-3xl font-light tracking-display-md leading-display-md text-white mb-4"
          style={{ fontFeatureSettings: '"ss01" on' }}
        >
          探索开源世界的每一个角落
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto mb-8" style={{ fontFeatureSettings: '"ss01" on' }}>
          从项目发现到深度分析，OpenGene 为你提供全方位的开源生态洞察
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          <div className="border border-white/10 rounded-stripe-lg p-5">
            <div className="tabular-nums text-3xl font-light text-white mb-1">10K+</div>
            <div className="text-sm text-white/60" style={{ fontFeatureSettings: '"ss01" on' }}>追踪项目</div>
          </div>
          <div className="border border-white/10 rounded-stripe-lg p-5">
            <div className="tabular-nums text-3xl font-light text-white mb-1">50+</div>
            <div className="text-sm text-white/60" style={{ fontFeatureSettings: '"ss01" on' }}>分析维度</div>
          </div>
          <div className="border border-white/10 rounded-stripe-lg p-5">
            <div className="tabular-nums text-3xl font-light text-white mb-1">99%</div>
            <div className="text-sm text-white/60" style={{ fontFeatureSettings: '"ss01" on' }}>数据准确率</div>
          </div>
        </div>
      </div>
    </section>
  )
}
