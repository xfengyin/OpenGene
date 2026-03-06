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
      // 解析仓库地址
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!match) {
        throw new Error('无效的 GitHub 仓库地址')
      }
      
      const [, owner, repo] = match
      
      // 获取仓库信息
      const repoRes = await fetch(`/api/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo })
      })
      
      if (!repoRes.ok) throw new Error('获取仓库信息失败')
      const repoData = await repoRes.json()
      
      // AI 分析
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
          recentCommits: 10 // 简化处理
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>🤖</span> AI 项目诊断师
      </h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="输入 GitHub 仓库地址 (如: https://github.com/facebook/react)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={analyzeRepo}
          disabled={analyzing}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 rounded-lg transition"
        >
          {analyzing ? '分析中...' : '开始诊断'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          {/* 健康度仪表盘 */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: '总体健康', value: result.healthScore },
              { label: '活跃度', value: result.activity },
              { label: '流行度', value: result.popularity },
              { label: '维护性', value: result.maintenance },
              { label: '社区', value: result.community },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 bg-gray-800 rounded-lg">
                <div className={`text-2xl font-bold ${getScoreColor(item.value)}`}>
                  {item.value}
                </div>
                <div className="text-xs text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* AI 建议 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span>💡</span> AI 建议
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{result.recommendation}</p>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* 预测和难度 */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-800 p-3 rounded-lg">
              <span className="text-gray-400">📊 预测增长</span>
              <p className="text-green-400 font-bold mt-1">{result.predictedGrowth}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <span className="text-gray-400">🎯 难度</span>
              <p className="text-yellow-400 font-bold mt-1">{result.difficulty}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <span className="text-gray-400">🔄 生命周期</span>
              <p className="text-blue-400 font-bold mt-1">{result.lifecycle}</p>
            </div>
          </div>

          {/* 学习路径 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <span>🎓</span> 推荐学习路径
            </h3>
            <ol className="space-y-2">
              {result.learningPath.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}