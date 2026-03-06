// AI 诊断服务 - 支持多种 AI 提供商

interface AIProvider {
  analyze(project: ProjectData): Promise<ProjectAnalysis>
}

interface ProjectData {
  repoName: string
  description: string
  language: string
  stars: number
  forks: number
  issues: number
  recentCommits: number
}

export interface ProjectAnalysis {
  healthScore: number
  activity: number
  popularity: number
  maintenance: number
  community: number
  recommendation: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  lifecycle: string
  tags: string[]
  predictedGrowth: string
  learningPath: string[]
}

// 模拟 AI 分析（当没有 API key 时使用）
function generateBasicAnalysis(
  stars: number,
  forks: number,
  issues: number,
  recentCommits: number
): ProjectAnalysis {
  const activity = Math.min(100, recentCommits * 3 + 20)
  const popularity = Math.min(100, Math.log10(stars + 1) * 20)
  const maintenance = issues > 0 ? Math.max(0, 100 - issues * 2) : 100
  const community = Math.min(100, Math.log10(forks + 1) * 25)
  const healthScore = Math.round((activity + popularity + maintenance + community) / 4)

  let difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = 'INTERMEDIATE'
  if (stars < 1000) difficulty = 'BEGINNER'
  else if (stars > 50000) difficulty = 'ADVANCED'

  let lifecycle = 'GROWING'
  if (recentCommits === 0) lifecycle = 'ARCHIVED'
  else if (recentCommits < 5) lifecycle = 'DECLINING'
  else if (stars > 10000 && recentCommits > 20) lifecycle = 'MATURE'

  const tags = generateTags(stars, forks, issues)

  return {
    healthScore,
    activity,
    popularity,
    maintenance,
    community,
    recommendation: getRecommendation(healthScore, difficulty),
    difficulty,
    lifecycle,
    tags,
    predictedGrowth: recentCommits > 10 ? '+10-20% in next 30 days' : 'Stable',
    learningPath: generateLearningPath(difficulty)
  }
}

function generateTags(stars: number, forks: number, issues: number): string[] {
  const tags: string[] = ['Open Source']
  
  if (stars > 10000) tags.push('Popular')
  if (stars > 50000) tags.push('Trending')
  if (forks > 1000) tags.push('Active Community')
  if (issues < 50) tags.push('Well Maintained')
  if (issues > 500) tags.push('Needs Help')
  
  return tags
}

function getRecommendation(score: number, difficulty: string): string {
  if (score >= 80) {
    return `这是一个非常健康的项目，适合${difficulty === 'BEGINNER' ? '初学者' : '有经验的开发者'}参与。社区活跃，维护良好，建议从文档改进或小型功能开始贡献。`
  } else if (score >= 60) {
    return `项目整体健康，但还有提升空间。适合想要挑战的开发者。建议关注未解决的issue，帮助项目改进。`
  } else {
    return `这个项目可能需要更多关注和维护。如果你有兴趣，可以考虑成为核心贡献者，帮助项目重回正轨。`
  }
}

function generateLearningPath(difficulty: string): string[] {
  const paths: Record<string, string[]> = {
    'BEGINNER': [
      '阅读项目文档和 README',
      '了解项目架构和代码结构',
      '寻找 "good first issue" 标签的 issue',
      '提交文档改进或小的 bug 修复',
      '参与社区讨论，了解开发流程'
    ],
    'INTERMEDIATE': [
      '深入理解核心模块的实现',
      '分析并解决中等难度的 issue',
      '添加新功能或改进现有功能',
      '编写测试用例提高覆盖率',
      '参与代码审查，学习最佳实践'
    ],
    'ADVANCED': [
      '研究项目的高级特性和架构设计',
      '解决复杂的技术难题',
      '优化性能和可扩展性',
      '指导新贡献者，分享经验',
      '参与项目决策和路线图规划'
    ]
  }
  
  return paths[difficulty] || paths['INTERMEDIATE']
}

// OpenAI 分析
async function openAIAnalyze(project: ProjectData): Promise<ProjectAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    console.log('OpenAI API key not found, using basic analysis')
    return generateBasicAnalysis(project.stars, project.forks, project.issues, project.recentCommits)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert open source analyst. Analyze projects objectively and provide actionable insights in JSON format.'
          },
          {
            role: 'user',
            content: `Analyze this open source project:
Repository: ${project.repoName}
Description: ${project.description}
Language: ${project.language}
Stars: ${project.stars}
Forks: ${project.forks}
Open Issues: ${project.issues}
Recent Commits: ${project.recentCommits}

Provide analysis in this JSON format:
{
  "healthScore": 0-100,
  "activity": 0-100,
  "popularity": 0-100,
  "maintenance": 0-100,
  "community": 0-100,
  "recommendation": "string with advice",
  "difficulty": "BEGINNER|INTERMEDIATE|ADVANCED",
  "lifecycle": "SEED|GROWING|MATURE|DECLINING|ARCHIVED",
  "tags": ["tag1", "tag2"],
  "predictedGrowth": "string",
  "learningPath": ["step1", "step2", "step3"]
}`
          }
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('Empty response from OpenAI')
    }

    // 提取 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('OpenAI analysis error:', error)
    return generateBasicAnalysis(project.stars, project.forks, project.issues, project.recentCommits)
  }
}

// 主分析函数
export async function analyzeProject(
  repoName: string,
  description: string,
  language: string,
  stars: number,
  forks: number,
  issues: number,
  recentCommits: number
): Promise<ProjectAnalysis> {
  const project: ProjectData = {
    repoName,
    description,
    language,
    stars,
    forks,
    issues,
    recentCommits
  }

  // 优先使用 OpenAI，失败时回退到基础分析
  try {
    return await openAIAnalyze(project)
  } catch (error) {
    console.log('Falling back to basic analysis')
    return generateBasicAnalysis(stars, forks, issues, recentCommits)
  }
}

// 生成学习路径
export async function generateLearningPath(
  goal: string,
  currentSkills: string[],
  targetLevel: string
): Promise<string[]> {
  const paths: Record<string, string[]> = {
    'frontend': [
      '学习 HTML/CSS/JavaScript 基础',
      '掌握 React 或 Vue 框架',
      '了解现代构建工具 (Webpack/Vite)',
      '学习 TypeScript',
      '参与开源前端项目'
    ],
    'backend': [
      '学习一门后端语言 (Node.js/Python/Go)',
      '掌握数据库设计',
      '了解 RESTful API 设计',
      '学习微服务架构',
      '参与开源后端项目'
    ],
    'fullstack': [
      '掌握前端基础技术栈',
      '学习后端开发',
      '了解 DevOps 基础',
      '掌握数据库技术',
      '构建全栈开源项目'
    ]
  }

  const normalizedGoal = goal.toLowerCase()
  for (const [key, path] of Object.entries(paths)) {
    if (normalizedGoal.includes(key)) {
      return path
    }
  }

  return [
    '选择感兴趣的技术领域',
    '学习该领域的基础知识',
    '通过小项目练习',
    '阅读优秀的开源项目代码',
    '开始贡献开源社区'
  ]
}