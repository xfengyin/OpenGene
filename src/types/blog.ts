// 博客文章数据模型
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: {
    name: string
    avatar: string
    github?: string
  }
  tags: string[]
  category: string
  publishedAt: Date
  updatedAt: Date
  views: number
  likes: number
  comments: number
  featured: boolean
  status: 'draft' | 'published' | 'archived'
}

export interface Comment {
  id: string
  postId: string
  author: {
    name: string
    avatar: string
  }
  content: string
  createdAt: Date
  likes: number
}

export const blogCategories = [
  { id: 'tutorial', name: '教程', icon: '📚' },
  { id: 'news', name: '开源资讯', icon: '📰' },
  { id: 'analysis', name: '项目分析', icon: '📊' },
  { id: 'interview', name: '人物专访', icon: '🎤' },
  { id: 'trends', name: '技术趋势', icon: '📈' },
]

// 模拟博客数据
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '2024年最值得关注的10个开源项目',
    slug: 'top-10-open-source-projects-2024',
    excerpt: '从AI工具到开发框架，这些项目正在改变开发者的工作方式...',
    content: `
# 2024年最值得关注的10个开源项目

开源社区在2024年迎来了爆发式增长。本文精选了10个最具潜力的项目...

## 1. OpenGene - 开源项目生态图谱

这是一个创新的平台，通过3D可视化展示开源项目生态系统...

## 2. 其他精彩项目

...更多内容
    `,
    coverImage: '/images/blog/featured-1.jpg',
    author: {
      name: 'OpenGene Team',
      avatar: 'https://avatars.githubusercontent.com/u/1',
      github: 'xfengyin'
    },
    tags: ['开源', '推荐', '2024'],
    category: 'news',
    publishedAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    views: 12500,
    likes: 856,
    comments: 128,
    featured: true,
    status: 'published'
  },
  {
    id: '2',
    title: '如何为你的开源项目吸引更多贡献者',
    slug: 'attract-contributors-to-open-source',
    excerpt: '从文档优化到社区建设，全面提升项目吸引力的实战指南...',
    content: `
# 如何为你的开源项目吸引更多贡献者

开源项目的成功离不开活跃的社区。本文将分享一些实用的技巧...

## 1. 完善的项目文档

好的文档是吸引贡献者的第一步...

## 2. 友好的入门体验

...更多内容
    `,
    author: {
      name: '开源社区',
      avatar: 'https://avatars.githubusercontent.com/u/2'
    },
    tags: ['开源', '社区', '贡献'],
    category: 'tutorial',
    publishedAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
    views: 8900,
    likes: 623,
    comments: 89,
    featured: false,
    status: 'published'
  },
  {
    id: '3',
    title: '深度解析：React vs Vue 生态系统对比',
    slug: 'react-vs-vue-ecosystem-analysis',
    excerpt: '从GitHub数据看两大前端框架的发展趋势和社区健康度...',
    content: `
# 深度解析：React vs Vue 生态系统对比

通过OpenGene平台的数据分析，我们可以深入了解这两个框架的发展状况...

## 数据对比

...更多内容
    `,
    author: {
      name: '数据分析师',
      avatar: 'https://avatars.githubusercontent.com/u/3'
    },
    tags: ['React', 'Vue', '数据分析'],
    category: 'analysis',
    publishedAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28'),
    views: 15200,
    likes: 945,
    comments: 234,
    featured: true,
    status: 'published'
  }
]