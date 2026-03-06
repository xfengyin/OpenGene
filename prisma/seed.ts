import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  
  // 创建示例项目
  const projects = [
    {
      githubId: '1',
      name: 'react',
      fullName: 'facebook/react',
      description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
      url: 'https://github.com/facebook/react',
      language: 'TypeScript',
      stars: 218000,
      forks: 46000,
      healthScore: 95,
      lifecycle: 'MATURE',
      aiSummary: '最流行的前端框架之一，社区活跃，文档完善',
      aiTags: ['Frontend', 'UI', 'JavaScript', 'React'],
      difficulty: 'INTERMEDIATE'
    },
    {
      githubId: '2',
      name: 'vue',
      fullName: 'vuejs/vue',
      description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework.',
      url: 'https://github.com/vuejs/vue',
      language: 'TypeScript',
      stars: 205000,
      forks: 34000,
      healthScore: 92,
      lifecycle: 'MATURE',
      aiSummary: '渐进式JavaScript框架，易学易用',
      aiTags: ['Frontend', 'Vue', 'JavaScript'],
      difficulty: 'BEGINNER'
    },
    {
      githubId: '3',
      name: 'next.js',
      fullName: 'vercel/next.js',
      description: 'The React Framework for Production',
      url: 'https://github.com/vercel/next.js',
      language: 'TypeScript',
      stars: 115000,
      forks: 25000,
      healthScore: 94,
      lifecycle: 'GROWING',
      aiSummary: '全栈React框架，支持SSR和静态生成',
      aiTags: ['Fullstack', 'React', 'SSR'],
      difficulty: 'INTERMEDIATE'
    }
  ]
  
  for (const project of projects) {
    await prisma.project.upsert({
      where: { githubId: project.githubId },
      update: project,
      create: project
    })
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })