# OpenGene 环境变量配置指南

## 必需配置

### 基础配置
```bash
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/opengene"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### GitHub 集成（可选但推荐）
```bash
# GitHub Personal Access Token
# 用于提高 API 速率限制 (5000 requests/hour vs 60 requests/hour)
# 创建地址: https://github.com/settings/tokens
GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# GitHub OAuth (用于用户登录)
GITHUB_CLIENT_ID="your-oauth-app-id"
GITHUB_CLIENT_SECRET="your-oauth-app-secret"
```

### AI 服务（可选）
```bash
# OpenAI API Key
# 用于项目智能分析
# 获取地址: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"

# 如果没有配置 OpenAI，系统会自动使用基础分析算法
```

## 配置步骤

### 1. 本地开发
```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local，填入你的配置
nano .env.local

# 启动开发服务器
npm run dev
```

### 2. Vercel 部署
1. 在 Vercel Dashboard 中选择你的项目
2. 进入 Settings → Environment Variables
3. 添加所有必需的环境变量
4. 重新部署项目

### 3. GitHub Actions
在仓库 Settings → Secrets and variables → Actions 中添加：
- `DATABASE_URL`
- `GITHUB_TOKEN`
- `OPENAI_API_KEY`
- `NEXTAUTH_SECRET`

## 验证配置

启动应用后，检查以下功能是否正常工作：

1. **项目加载** - 首页应该显示项目列表
2. **GitHub API** - 搜索功能应该返回结果
3. **AI 分析** - 诊断功能应该返回分析结果
4. **数据库** - 用户登录和数据持久化

## 故障排除

### API 速率限制
如果没有配置 `GITHUB_TOKEN`，可能会遇到：
```
GitHub API error: 403
```
解决方案：配置 GITHUB_TOKEN

### AI 分析失败
如果没有配置 `OPENAI_API_KEY`：
- 系统会自动使用基础分析算法
- 功能仍然可用，但分析质量可能较低

### 数据库连接失败
```
Error: Database connection failed
```
检查：
1. PostgreSQL 服务是否运行
2. DATABASE_URL 格式是否正确
3. 数据库用户权限是否足够