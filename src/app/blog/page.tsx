import BlogList from '@/components/blog/BlogList'
import BlogNav from '@/components/blog/BlogNav'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '博客 - OpenGene',
  description: '发现开源世界的故事、教程和洞见'
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* 主导航栏 */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              OpenGene
            </span>
          </a>
          <a 
            href="/"
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm"
          >
            ← 返回首页
          </a>
        </div>
      </nav>

      {/* 博客子导航 */}
      <BlogNav />

      {/* 主内容 */}
      <div className="pt-32">
        <BlogList />
      </div>
    </main>
  )
}