'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BlogNav() {
  const pathname = usePathname()
  const isBlogPage = pathname?.includes('/blog')

  if (!isBlogPage) return null

  return (
    <nav className="fixed top-16 left-0 right-0 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 text-sm">
          <Link 
            href="/OpenGene/" 
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>返回首页</span>
          </Link>
          <span className="text-gray-600">|</span>
          <Link 
            href="/OpenGene/blog/" 
            className={`transition-colors ${pathname === '/OpenGene/blog' || pathname === '/OpenGene/blog/' ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
          >
            全部文章
          </Link>
          <Link 
            href="/OpenGene/blog/?category=技术" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            技术
          </Link>
          <Link 
            href="/OpenGene/blog/?category=生态" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            生态
          </Link>
          <Link 
            href="/OpenGene/blog/?category=趋势" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            趋势
          </Link>
        </div>
      </div>
    </nav>
  )
}
