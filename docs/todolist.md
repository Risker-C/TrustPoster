
## 完整开发计划（按小时 / 按模块）

> 假设总时间目标：**5–8 小时实现可演示的 MVP**
> 时间不够时，优先级：**基础流程 > AI 美化 > 高级链上功能**

我按 **阶段 + 预计时长 + 目标产物** 来拆。

---

### 阶段 0：项目初始化（约 0.5–1 小时）

**目标：** 运行起来的 Next.js + shadcn/ui + 基础页面骨架。

* 创建 Next.js + TypeScript 项目
* 配置 Tailwind
* 初始化 shadcn/ui，并添加基础组件（button/card/input/form）
* 建好基础页面路由：

  * `/create`
  * `/poster/[id]`

> 完成标志：访问 `/create` 能看到一个基础表单 + 空白预览卡片。

---

### 阶段 1：前端创建流程 + AI 生成（约 1.5–2 小时）

**目标：** 在 `/create` 页实现完整“输入 GitHub → AI 生成内容 → 海报预览”。

* 在 `/create` 页：

  * 使用 `react-hook-form + zod` 构建表单（GitHub 输入、手动补充字段）
  * 调用 `/api/generate/bio`（先写个简单 mock，后续再接 GitHub & LLM）
  * 将返回的数据填充到预览组件 `PosterPreview`
  * 使用 shadcn/card、badge、typography 打造一个漂亮的海报预览 UI（还没真正生成 PNG）

> 完成标志：输入 GitHub 后，点击“AI 生成简介”，预览区显示真实内容（bio/skills/score）。

---

### 阶段 2：AI 服务与 GitHub 接入（约 1–1.5 小时）

**目标：** `/api/generate/bio` 变成真正能分析 GitHub 数据并调用 LLM 的接口。

* 实现 `GET/POST /api/generate/bio`:

  * 接收 GitHub username/url
  * 调用 GitHub API 获取基本信息：

    * 仓库数、Star、语言分布、最近更新时间等
  * 构造 LLM Prompt
  * 调用 LLM 输出：

    * bio
    * skills
    * highlights
    * trustScore
* 前端对接真实接口（替换 mock）

> 完成标志：对于真实 GitHub 账号，生成的简介/技能/评分看起来“像回事”。

---

### 阶段 3：海报图像生成 + Walrus 上传（约 1–1.5 小时）

**目标：** 把预览变成真正的图片，上传到 Walrus，拿到 blobId。

* 在前端或后端实现：

  * 使用 html2canvas / dom-to-image，将海报区域渲染为 PNG Blob
* 实现 `lib/walrus` 的简单封装：

  * `uploadPosterImage(blob) -> blobId`
* 实现 `/api/poster/create`：

  * 接收表单 + AI 内容
  * 接收或生成 PNG Blob（视架构而定）
  * 调用 Walrus 上传
  * 暂时先用内存/数据库 mock 记录 posterId ↔ blobId（这一步可以在接 Sui 之前作为 placeholder）
* 前端点击“生成并上传”按钮：

  * 完成整个流程并显示 `blobId`

> 完成标志：你可以上传一张真实的海报图片到 Walrus 并拿回一个 blobId。

---

### 阶段 4：Sui 链上合约 + Poster 版本结构（约 1.5–2 小时）

**目标：** 链上有 Poster 对象，并能记录多个版本（海报可更新）。

* 编写 Move 合约模块 `trust_poster`：

  * Poster & PosterVersion 结构体
  * `create_poster(blob_id, trust_score)`：创建新 Poster
  * `add_version(poster_id, blob_id, trust_score)`：追加新版本
* 使用 Sui CLI 部署合约到 testnet
* 在前端/后端实现 `lib/sui`：

  * `createPosterOnChain(blobId, trustScore, owner) -> posterId`
  * `addPosterVersionOnChain(posterId, blobId, trustScore)`
  * `getPosterFromChain(posterId) -> {owner, versions}`

> 完成标志：通过 Sui Explorer 能看到 Poster 对象，并包含 versions 数组。

---

### 阶段 5：海报展示页 + 版本时间线（约 1–1.5 小时）

**目标：** `/poster/[posterId]` 能展示当前版本 + 历史版本。

* 实现 `/api/poster/get`：

  * 根据 `posterId` 从链上读对象
  * 解析所有版本的 `blobId / trustScore / timestamp`
* 前端 `/poster/[posterId]`：

  * 默认展示最新版本海报（通过 Walrus blobId 渲染图片）
  * 用 shadcn 组件构建版本时间线 `VersionTimeline`
  * 用户点击历史版本：

    * 切换海报图与信息
* 在 `/poster/[posterId]` 页面加一个“更新海报”按钮，跳转到 `/create?posterId=xxx`，为下一阶段更新功能做准备

> 完成标志：可以点开一个 poster，查看它的最新版本和历史版本列表。

---

### 阶段 6：海报更新流程（约 1 小时）

**目标：** 一个完整“海报可更新”的回路。

* 在 `/create` 中识别是否带 `posterId` 参数：

  * 如果有：视为“更新模式”，UI 显示“基于已有海报创建新版本”
* 更新流程：

  * 重新输入 GitHub / 更新自定义信息
  * 调用 `/api/generate/bio` → 渲染新海报预览
  * 提交时调用 `/api/poster/update`：

    * 上传新 PNG 至 Walrus → newBlobId
    * 调用 Move `add_version`
* 回到 `/poster/[posterId]`：

  * 能看到新版本出现在时间线中，默认展示最新版本

> 完成标志：你能对同一个 poster 做多次更新，并看到 V1/V2/V3 的变化。

---

### 阶段 7：美化、打磨 & 提交流程（约 1–1.5 小时）

**目标：** 变成一个可以直接参加黑客松的产品。

* 用 shadcn/ui 和 Tailwind 做整体 UI 打磨：

  * 渐变背景、阴影、间距
  * 统一颜色（primary / accent）
* 首页 `/`：

  * 简洁介绍、流程图、CTA 按钮（开始生成海报）
* 编写 README：

  * 项目简介
  * 架构说明（可以用上面这份的简化版）
  * 使用说明
* 准备小 demo 脚本 / 截图：

  * 创建海报
  * 更新海报
  * 展示版本时间线

> 完成标志：你可以用它来录一段 30–60 秒 demo 视频，足以参加黑客松。
