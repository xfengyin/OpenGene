# 🧬 OpenGene

> AI驱动的开源项目生态图谱平台 - 首个3D可视化开源项目发现平台

[![CI/CD](https://github.com/xfengyin/OpenGene/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/xfengyin/OpenGene/actions)
[![Auto Audit](https://github.com/xfengyin/OpenGene/actions/workflows/auto-audit.yml/badge.svg)](https://github.com/xfengyin/OpenGene/actions)

## ✨ 核心特性

### 🌌 星系图谱
- **3D可视化**：项目以星球形式展示，大小代表影响力
- **动态连线**：相似项目自动连接，形成生态网络
- **实时演化**：项目成长、合并、消亡可视化追踪

### 🤖 AI 诊断师
- **健康度分析**：5维度评分（活跃度、流行度、维护性、社区、总体）
- **生命周期预测**：自动识别项目阶段（萌芽/成长/成熟/衰退/归档）
- **智能推荐**：基于AI的个性化学习路径

### 🏆 贡献者荣耀
- **段位系统**：青铜 → 白银 → 黄金 → 钻石 → 大师 → 传奇
- **成就徽章**：首次贡献、持续贡献、关键修复等
- **人才发现**：企业可发现优质开源贡献者

### 📊 数据驱动
- **GitHub API**：实时同步项目数据
- **健康度评分**：基于多维度算法
- **趋势预测**：AI预测项目未来发展

## 🛠️ 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **可视化**: Canvas API + 自定义渲染引擎
- **数据库**: PostgreSQL + Prisma ORM
- **AI**: OpenAI GPT-4 API
- **认证**: NextAuth.js + GitHub OAuth
- **部署**: GitHub Pages + GitHub Actions

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 14+
- GitHub Token (可选，提高API限制)

### 安装

```bash
# 克隆项目
git clone https://github.com/xfengyin/OpenGene.git
cd OpenGene

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加必要的环境变量

# 初始化数据库
npx prisma migrate dev
npx prisma generate

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
OpenGene/
├── .github/
│   └── workflows/        # CI/CD 工作流
│       ├── ci-cd.yml     # 主CI/CD流程
│       └── auto-audit.yml # 自动审计合并
├── prisma/
│   ├── schema.prisma     # 数据库模型
│   └── seed.ts           # 种子数据
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 路由
│   │   │   ├── ai/       # AI 分析API
│   │   │   ├── auth/     # 认证API
│   │   │   ├── github/   # GitHub API代理
│   │   │   └── projects/ # 项目数据API
│   │   ├── layout.tsx    # 根布局
│   │   └── page.tsx      # 主页面
│   ├── components/       # React组件
│   │   ├── galaxy/       # 星系图谱组件
│   │   ├── project/      # 项目相关组件
│   │   └── ui/           # UI组件
│   ├── lib/              # 工具库
│   │   ├── ai.ts         # AI服务
│   │   ├── db.ts         # 数据库客户端
│   │   └── github.ts     # GitHub API服务
│   ├── types/            # TypeScript类型
│   └── styles/           # 全局样式
├── .env.example          # 环境变量示例
├── next.config.js        # Next.js配置
└── package.json          # 依赖配置
```

## 🔧 开发工作流

### 分支策略
- `master`: 主分支，生产环境代码
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复分支

### 自动审计流程
1. 推送代码到功能分支
2. GitHub Actions 自动运行：
   - TypeScript 类型检查
   - ESLint 代码检查
   - 安全审计 (npm audit)
   - 构建测试
3. 通过后自动创建 PR
4. 代码审查后自动合并到 master

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 🗺️ 路线图

### Phase 1 (已完成 ✅)
- [x] 基础项目结构
- [x] GitHub API集成
- [x] 3D星系图谱
- [x] AI诊断原型
- [x] CI/CD配置

### Phase 2 (进行中 🚧)
- [ ] 实时数据同步
- [ ] 用户认证系统
- [ ] 贡献者荣耀系统
- [ ] 项目依赖关系分析

### Phase 3 (计划中 📋)
- [ ] 高级AI分析
- [ ] 学习路径生成
- [ ] 社区功能
- [ ] 移动端适配

### Phase 4 (未来 🔮)
- [ ] 企业版功能
- [ ] API开放平台
- [ ] 数据报告服务
- [ ] 多语言支持

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

MIT License © 2026 OpenGene

---

<p align="center">
  Made with 💜 by <a href="https://github.com/xfengyin">xfengyin</a>
</p>