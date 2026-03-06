/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'github.com'],
    unoptimized: true,
  },

  // 静态导出配置
  output: 'export',
  distDir: 'dist',
  // 动态路由配置
  trailingSlash: true,
}

module.exports = nextConfig