import BlogList from '@/components/blog/BlogList'
import BlogNav from '@/components/blog/BlogNav'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '博客 - OpenGene',
  description: '发现开源世界的故事、教程和洞见'
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-stripe-white">
      {/* Stripe-style Navigation */}
      <nav className="stripe-nav fixed top-0 w-full z-50">
        <div className="max-w-[1080px] mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <span className="text-xl font-light tracking-display-xs text-stripe-heading" style={{ fontFeatureSettings: '"ss01" on' }}>
              <span className="stripe-text-gradient font-normal">OpenGene</span>
            </span>
          </a>
          <a 
            href="/"
            className="stripe-btn-ghost text-sm py-1.5 px-3"
          >
            ← 返回首页
          </a>
        </div>
      </nav>

      {/* Blog Sub-nav */}
      <BlogNav />

      {/* Main Content */}
      <div className="pt-32">
        <BlogList />
      </div>
    </main>
  )
}
