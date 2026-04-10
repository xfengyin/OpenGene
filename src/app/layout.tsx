import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter, Source_Code_Pro } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-source-code-pro',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OpenGene - 开源项目生态图谱',
  description: 'AI驱动的开源项目生态图谱平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${sourceCodePro.variable} font-sans bg-stripe-white text-stripe-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
