# TrustPoster

AI × Web3 去中心化自我介绍海报系统

## 项目简介

TrustPoster 是一个基于 AI 生成和 Web3 技术的去中心化个人简介海报系统。用户可以通过输入 GitHub 信息，AI 自动生成专业的个人简介，并存储在去中心化网络 Walrus 上，同时在 Sui 链上记录版本历史。

## 技术栈

- **前端**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **AI 服务**: GitHub API + LLM (mock)
- **存储**: Walrus 去中心化存储 (mock)
- **区块链**: Sui + Move 智能合约 (mock)

## 功能特性

- 🤖 AI 智能生成个人简介和技能标签
- 🎨 精美的海报设计和实时预览
- 📸 支持下载海报图片
- 🔄 支持版本更新和历史记录
- ⛓️ 链上验证，确保数据真实性
- 🌐 去中心化存储，永不丢失

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 运行开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 项目结构

```
src/
  app/                  # Next.js App Router 页面
    create/            # 创建海报页面
    poster/[id]/       # 海报展示页面
    api/               # API 路由
  components/          # React 组件
    poster/            # 海报相关组件
    ui/                # shadcn/ui 基础组件
  lib/                 # 工具库和业务逻辑
    ai.ts              # AI 生成模块
    walrus.ts          # Walrus 存储模块
    sui.ts             # Sui 链上操作
    types.ts           # TypeScript 类型定义
```

## 使用流程

1. **创建海报**
   - 访问 `/create` 页面
   - 输入 GitHub 链接
   - 点击 "AI 生成简介"
   - 预览并确认海报内容
   - 点击 "上链并发布"

2. **查看海报**
   - 访问 `/poster/[id]` 查看已发布的海报
   - 查看版本历史和信任分数

3. **更新海报**
   - 在海报页面点击 "更新海报"
   - 修改信息或重新生成
   - 创建新版本

## Mock 说明

当前版本使用 Mock 数据：
- AI 生成是基于用户名的伪随机内容
- Walrus 上传返回假的 blobId
- Sui 链上操作使用模拟数据

## 未来计划

- [ ] 接入真实的 GitHub API
- [ ] 集成 GPT-4 或其他 LLM 服务
- [ ] 集成 Walrus SDK 进行文件上传
- [ ] 部署 Sui Move 智能合约
- [ ] 添加钱包连接功能
- [ ] 支持更多数据源（Twitter, LinkedIn 等）

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
