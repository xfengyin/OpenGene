// AI 诊断服务
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

export async function analyzeProject(
  repoName: string,
  description: string,
  language: string,
  stars: number,
  forks: number,
  issues: number,
  recentCommits: number
): Promise<ProjectAnalysis> {
  const prompt = `Analyze this open source project and provide insights:

Repository: ${repoName}
Description: ${description}
Language: ${language}
Stars: ${stars}
Forks: ${forks}
Open Issues: ${issues}
Recent Commits (30 days): ${recentCommits}

Please provide analysis in JSON format with these fields:
- healthScore (0-100)
- activity (0-100) 
- popularity (0-100)
- maintenance (0-100)
- community (0-100)
- recommendation (string with advice for contributors)
- difficulty (BEGINNER, INTERMEDIATE, or ADVANCED)
- lifecycle (SEED, GROWING, MATURE, DECLINING, or ARCHIVED)
- tags (array of relevant technology tags)
- predictedGrowth (string describing expected growth)
- learningPath (array of 3-5 steps to learn from this project)`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert open source analyst. Analyze projects objectively and provide actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid AI response format')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('AI analysis error:', error)
    // Fallback to basic analysis
    return generateBasicAnalysis(stars, forks, issues, recentCommits)
  }
}

function generateBasicAnalysis(
  stars: number,
  forks: number,
  issues: number,
  recentCommits: number
): ProjectAnalysis {
  const activity = Math.min(100, recentCommits * 3)
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

  return {
    healthScore,
    activity,
    popularity,
    maintenance,
    community,
    recommendation: getRecommendation(healthScore, difficulty),
    difficulty,
    lifecycle,
    tags: ['Open Source'],
    predictedGrowth: recentCommits > 10 ? '+10-20% in next 30 days' : 'Stable',
    learningPath: [
      'Read the documentation and README',
      'Explore the codebase structure',
      'Look at good first issues',
      'Start with small contributions',
      'Engage with the community'
    ]
  }
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

// 生成学习路径
export async function generateLearningPath(
  goal: string,
  currentSkills: string[],
  targetLevel: string
): Promise<string[]> {
  const prompt = `Create a learning path for someone who wants to ${goal}.
Current skills: ${currentSkills.join(', ')}
Target level: ${targetLevel}

Provide 5 specific open source projects they should study, in order of difficulty.
Format as a JSON array of strings.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a technical mentor specializing in open source education.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) return defaultLearningPath(goal)

    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return defaultLearningPath(goal)

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    return defaultLearningPath(goal)
  }
}

function defaultLearningPath(goal: string): string[] {
  return [
    'Start with beginner-friendly projects like freeCodeCamp or first-contributions',
    'Study well-documented projects in your target domain',
    'Contribute to medium-sized active projects',
    'Take on larger features and code reviews',
    'Become a maintainer or create your own project'
  ]
}