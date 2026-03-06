'use client'

import { useState } from 'react'

export default function AIDiagnostic() {
  const [repoUrl, setRepoUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const analyzeRepo = async () => {
    if (!repoUrl) return
    setAnalyzing(true)
    setTimeout(() => {
      setResult({
        healthScore: 87,
        activity: 92,
        popularity: 85,
        recommendation: '该项目活跃度高，社区健康，适合学习和贡献。',
        difficulty: 'INTERMEDIATE',
      })
      setAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">🤖 AI 项目诊断</h2>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="输入 GitHub 仓库地址"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 rounded-lg"
        />
        <button
          onClick={analyzeRepo}
          disabled={analyzing}
          className="px-6 py-2 bg-purple-600 rounded-lg"
        >
          {analyzing ? '分析中...' : '诊断'}
        </button>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <p>健康度: {result.healthScore}</p>
          <p>活跃度: {result.activity}</p>
          <p className="mt-2">{result.recommendation}</p>
        </div>
      )}
    </div>
  )
}