'use client'

import { useState } from 'react'

interface AnalysisResult {
  healthScore: number
  activity: number
  popularity: number
  maintenance: number
  community: number
  recommendation: string
  difficulty: string
  lifecycle: string
  tags: string[]
  predictedGrowth: string
  learningPath: string[]
}

export default function AIDiagnostic() {
  const [repoUrl, setRepoUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const analyzeRepo = async () => {
    if (!repoUrl) {
      setError('请输入 GitHub 仓库地址')
      return
    }
    
    setAnalyzing(true)
    setError('')
    setResult(null)
    
    try {
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!match) {
        throw new Error('无效的 GitHub 仓库地址')
      }
      
      const [, owner, repo] = match
      
      const repoRes = await fetch(`/api/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo })
      })
      
      if (!repoRes.ok) throw new Error('获取仓库信息失败')
      const repoData = await repoRes.json()
      
      const aiRes = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: repoData.name,
          description: repoData.description,
          language: repoData.language,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          issues: repoData.open_issues_count,
          recentCommits: 10
        })
      })
      
      if (!aiRes.ok) throw new Error('AI 分析失败')
      const analysis = await aiRes.json()
      
      setResult(analysis)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'stripe-badge-success'
    if (score >= 60) return 'bg-yellow-50 text-stripe-lemon border border-yellow-200'
    return 'bg-red-50 text-stripe-ruby border border-red-200'
  }

  return (
    <div className="stripe-card p-6">
      <h2 
        className="text-2xl font-light tracking-display-md leading-display-md text-stripe-heading mb-5 flex items-center gap-2"
        style={{ fontFeatureSettings: '"ss01" on' }}
      >
        <span>🤖</span> AI 项目诊断师
      </h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="输入 GitHub 仓库地址 (如: https://github.com/facebook/react)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="stripe-input flex-1"
        />
        <button
          onClick={analyzeRepo}
          disabled={analyzing}
          className="stripe-btn-primary text-sm"
        >
          {analyzing ? '分析中...' : '开始诊断'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-stripe text-stripe-ruby text-sm" style={{ fontFeatureSettings: '"ss01" on' }}>
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          {/* Health Dashboard - Stripe data cards */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: '总体健康', value: result.healthScore },
              { label: '活跃度', value: result.activity },
              { label: '流行度', value: result.popularity },
              { label: '维护性', value: result.maintenance },
              { label: '社区', value: result.community },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 bg-stripe-white border border-stripe-border rounded-stripe-lg">
                <div className={`tabular-nums text-2xl font-light ${item.value >= 80 ? 'text-stripe-success' : item.value >= 60 ? 'text-stripe-lemon' : 'text-stripe-ruby'}`}>
                  {item.value}
                </div>
                <div className="text-xs text-stripe-body mt-1" style={{ fontFeatureSettings: '"ss01" on' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* AI Recommendation */}
          <div className="bg-stripe-white border border-stripe-border rounded-stripe-lg p-4">
            <h3 
              className="font-light text-stripe-heading mb-2 flex items-center gap-2"
              style={{ fontFeatureSettings: '"ss01" on' }}
            >
              <span>💡</span> AI 建议
            </h3>
            <p className="text-stripe-body text-sm leading-body" style={{ fontFeatureSettings: '"ss01" on' }}>{result.recommendation}</p>
          </div>

          {/* Tags - Stripe tag style */}
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag: string) => (
              <span key={tag} className="stripe-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Predictions - Stripe data cards */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-stripe-white border border-stripe-border rounded-stripe-lg p-4">
              <span className="text-stripe-body" style={{ fontFeatureSettings: '"ss01" on' }}>📊 预测增长</span>
              <p className="tabular-nums text-stripe-success font-light mt-1" style={{ fontFeatureSettings: '"tnum" on, "ss01" on' }}>{result.predictedGrowth}</p>
            </div>
            <div className="bg-stripe-white border border-stripe-border rounded-stripe-lg p-4">
              <span className="text-stripe-body" style={{ fontFeatureSettings: '"ss01" on' }}>🎯 难度</span>
              <p className="text-stripe-lemon font-light mt-1" style={{ fontFeatureSettings: '"ss01" on' }}>{result.difficulty}</p>
            </div>
            <div className="bg-stripe-white border border-stripe-border rounded-stripe-lg p-4">
              <span className="text-stripe-body" style={{ fontFeatureSettings: '"ss01" on' }}>🔄 生命周期</span>
              <p className="text-stripe-purple font-light mt-1" style={{ fontFeatureSettings: '"ss01" on' }}>{result.lifecycle}</p>
            </div>
          </div>

          {/* Learning Path */}
          <div className="bg-stripe-white border border-stripe-border rounded-stripe-lg p-4">
            <h3 
              className="font-light text-stripe-heading mb-3 flex items-center gap-2"
              style={{ fontFeatureSettings: '"ss01" on' }}
            >
              <span>🎓</span> 推荐学习路径
            </h3>
            <ol className="space-y-3">
              {result.learningPath.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-stripe-purple rounded-full flex items-center justify-center text-xs text-white font-normal">
                    {index + 1}
                  </span>
                  <span className="text-stripe-body leading-body" style={{ fontFeatureSettings: '"ss01" on' }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
