'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BlogNav() {
  const pathname = usePathname()
  const isBlogPage = pathname?.includes('/blog')

  if (!isBlogPage) return null

  return (
    <nav className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stripe-border">
      <div className="max-w-[1080px] mx-auto px-4 py-3">
        <div className="flex items-center gap-4 text-sm" style={{ fontFeatureSettings: '"ss01" on' }}>
          <Link 
            href="/" 
            className="flex items-center gap-1 text-stripe-body hover:text-stripe-heading transition-colors"
          >
            <span>←</span>
            <span>返回首页</span>
          </Link>
          <span className="text-stripe-border">|</span>
          <Link 
            href="/blog/" 
            className={`transition-colors ${pathname?.endsWith('/blog/') ? 'text-stripe-purple font-normal' : 'text-stripe-body hover:text-stripe-heading'}`}
          >
            全部文章
          </Link>
          <Link 
            href="/blog/?category=技术" 
            className="text-stripe-body hover:text-stripe-heading transition-colors"
          >
            技术
          </Link>
          <Link 
            href="/blog/?category=生态" 
            className="text-stripe-body hover:text-stripe-heading transition-colors"
          >
            生态
          </Link>
          <Link 
            href="/blog/?category=趋势" 
            className="text-stripe-body hover:text-stripe-heading transition-colors"
          >
            趋势
          </Link>
        </div>
      </div>
    </nav>
  )
}
