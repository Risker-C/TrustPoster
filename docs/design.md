## 技术方案

### 1. 整体架构概览

可以把 TrustPoster 看成是一个由 **前端 Web App + AI 服务 + Web3 基础设施（Walrus + Sui）** 组成的系统：

```text
┌──────────────────────────────┐
│          前端 Web App        │
│  Next.js + shadcn/ui + Sui   │
│                              │
│  - 创建海报页面 /create      │
│  - 展示海报页面 /poster/[id] │
│  - 仪表盘 /dashboard         │
└───────────────▲──────────────┘
                │ HTTP / Wallet
                ▼
┌──────────────────────────────┐
│       后端 API（Next.js）     │
│  /api/generate/bio           │
│  /api/poster/create          │
│  /api/poster/update          │
│  /api/poster/get             │
└───────────────▲──────────────┘
                │
         AI 调用 / SDK 调用
                │
 ┌──────────────┴───────────────┐
 │                              │
 ▼                              ▼
┌────────────────────┐   ┌────────────────────┐
│   AI 内容生成模块  │   │  Web3 存储与链上模块 │
│ (GitHub + LLM)     │   │ Walrus + Sui + Move │
│ - Bio / Skills     │   │ - 上传海报到 Walrus │
│ - TrustScore       │   │ - 写入/更新链上数据 │
└────────────────────┘   └────────────────────┘
```

---

### 2. 模块拆解

#### 2.1 前端模块（Next.js + shadcn/ui）

**页面模块**

1. `/create` – 创建/更新海报页（核心交互）

   * 表单输入模块：GitHub 链接 + 自定义字段
   * AI 生成模块：点击按钮 → 调用 `/api/generate/bio`
   * 海报预览模块：展示 AI 文案 + TrustScore + 渲染成海报视图
   * 上传按钮：调用 `/api/poster/create`，完成 Walrus + Sui 写入

2. `/poster/[id]` – 单个海报展示页

   * 根据 URL 参数 `[id]`（可以是内部 posterId 或 blobId）
   * 从后端/链上获取：

     * 当前最新版本海报信息
     * 所有版本历史（用来展示时间线）
   * UI：

     * 显示当前版本海报图
     * 信任分数、版本号、创建时间
     * Walrus 链接 / blobId
     * “查看历史版本”抽屉或时间线

3. `/dashboard` – 用户海报列表与版本管理（可选）

   * 列出该钱包地址名下的所有 Poster
   * 每个 Poster 展示：

     * 最新版本的 TrustScore、更新时间
     * 入口链接 /poster/\[id]

**组件模块（shadcn/ui）**

* `PosterForm`：表单（GitHub、额外说明、自定义字段）
* `PosterPreview`：海报预览卡片
* `TrustScoreBadge`：信任分数字样化展示
* `VersionTimeline`：版本列表（V1 / V2 / V3 ...）
* `WalletConnect`：Sui 钱包连接按钮

---

#### 2.2 后端 API 模块（Next.js Route Handlers）

后端的职责是**协调 AI、Walrus、Sui**，前端只调用统一的 HTTP 接口。

1. **`POST /api/generate/bio`**

   * 输入：GitHub URL 或 username
   * 逻辑：

     1. 调用 GitHub API 获取公开数据（仓库数量、Star、语言、最近 commit 等）
     2. 把这些结构化数据作为上下文丢给 LLM
     3. LLM 输出：

        * `bio`: string
        * `skills`: string\[]
        * `highlights`: string\[]
        * `trustScore`: number(0-100)
   * 输出：上述四者的 JSON

2. **`POST /api/poster/create`（创建新海报 / 新 Poster 对象 & 首个版本）**

   * 输入：

     * AI 生成结果（bio/skills/trustScore 等）
     * 用户自定义字段
     * 钱包地址（由前端传入或后端从签名中解析）
   * 逻辑：

     1. 使用 HTML/Canvas 渲染海报图（可以在前端渲染后传 Blob，也可以在后端用 headless 浏览器渲染）
     2. 调用 Walrus SDK 上传图片 Blob → 得到 `blobId`
     3. 调用 Sui.js → 调用 Move 合约 `create_poster`，写入：

        * owner 地址
        * versions\[0] = { blob\_id, trust\_score, timestamp }
     4. 返回 posterId（可以是链上对象 ID）, 和 `blobId`
   * 输出：

     * `posterId`
     * `blobId`
     * `trustScore`

3. **`POST /api/poster/update`（为已有 Poster 新增版本）**

   * 输入：

     * `posterId`
     * 新一轮 AI 生成的 `bio/skills/trustScore` 或用户手动输入内容
   * 逻辑：

     1. 根据新内容重新渲染海报 → 生成图片 Blob
     2. 上传 Walrus → 获得 `newBlobId`
     3. 调用 Move 合约 `add_version(posterId, newBlobId, trustScore, timestamp)`
   * 输出：

     * 新版本序号
     * 新 `blobId`
     * 最新 `trustScore`

4. **`GET /api/poster/get?posterId=xxx`（获取 Poster 及其最新内容）**

   * 输入：`posterId`
   * 逻辑：

     1. 调用 Sui RPC 查询 Poster 对象
     2. 返回：

        * owner
        * 最新版本数据（最后一个版本）
        * 所有版本数组（blobId + trustScore + timestamp）
   * 输出：Poster 详情 JSON

---

#### 2.3 AI 模块（GitHub + LLM）

**输入数据源：**

* GitHub 用户名 / URL
* 可扩展：Twitter / Lens / Farcaster / on-chain stats

**AI 提示结构（逻辑上）：**

> 给定一个开发者的公开 GitHub 数据（仓库、语言、stars、贡献频率等），
> 请生成：
>
> 1. 一段 40\~80 字的个人简介，偏向 Web3 / 开发者身份
> 2. 3–7 个技能标签（如：Solidity, DeFi, ZK, Frontend, Rust）
> 3. 3–5 条具体贡献亮点（如：参与某项目、贡献某库）
> 4. 一个从 0 到 100 的信任评分（TrustScore），衡量其活跃度与可信程度。
>    返回 JSON 格式数据，字段为：bio, skills, highlights, trustScore。

**实现选择：**

* 简化版：直接用某大模型 API（你后面可以决定用哪家）
* 强化版：先用传统逻辑算一个基础 TrustScore（比如：star 数、commit 数），再让 AI 微调与解释评分理由

---

#### 2.4 Walrus 存储模块

模块职责：**上传/下载海报图片 & 元数据**。

* 函数：

  * `uploadPosterImage(pngBlob) -> blobId`
  * （可选）`getPosterUrl(blobId) -> url`
* 存储内容：

  * 海报图片
  * 可以附带 JSON metadata（比如 bio/skills/rawGitHubData hash）

Walrus 提供了内容寻址的不可篡改存储，非常适合做“版本化海报”。

---

#### 2.5 Sui 链上模块（Move 合约）

**核心结构：**

* `Poster`（一个完整的“身份”对象，对应某个用户）
* `PosterVersion`（Poster 的一个版本）

简化逻辑：

* Poster:

  * `owner: address`
  * `versions: vector<PosterVersion>`

* PosterVersion:

  * `blob_id: vector<u8>`
  * `trust_score: u64`
  * `timestamp: u64`

**关键函数：**

* `create_poster(blob_id, trust_score)`
  新建一个 Poster，versions 中插入第一个版本。

* `add_version(poster_id, blob_id, trust_score)`
  在已有 Poster 上追加一个版本 → 支持“海报更新”。

* `get_latest_version(poster_id)`
  返回版本列表中的最后一个元素。

* （可扩展）`update_score(poster_id, version_index, new_score)`
  仅更新评分而不改图片内容。

---

### 3. 数据流说明

#### 3.1 创建海报（新用户 / 新 Poster）

1. 用户在 `/create` 页：

   * 输入 GitHub 地址
   * 点击 **“AI 生成简介”**

2. 前端调用 `POST /api/generate/bio`：

   * 后端调用 GitHub API 获取公开数据
   * 调用 LLM 生成：bio, skills, highlights, trustScore
   * 返回前端

3. 前端填充表单 + 显示海报预览：

   * 用户可以修改 / 微调 AI 生成内容
   * 满意后点击 **“生成并上链”** 按钮

4. 前端渲染海报视图（HTML → Canvas → PNG Blob）并发送到 `POST /api/poster/create`

5. 后端：

   * 调用 Walrus 上传 PNG → 得到 `blobId`
   * 调用 Sui.js → 发送交易 → 调用 Move 的 `create_poster`：

     * owner = 当前钱包地址
     * versions\[0] = { blobId, trustScore, timestamp }
   * 返回前端：`posterId`（链上对象 ID）、`blobId`

6. 前端跳转到 `/poster/[posterId]` 展示海报 + 链上信息。

---

#### 3.2 更新海报（同一用户，新的版本）

1. 用户在 `/poster/[posterId]` 页点击 **“更新海报”** 或回到 `/create` 选择“基于已有 Poster 更新”。

2. 前端：

   * 再次调用 `/api/generate/bio`（或允许用户手动修改内容）
   * 渲染新版本海报视图 → 生成 PNG Blob

3. 前端调用 `POST /api/poster/update`：

   * 参数：`posterId` + 新内容数据

4. 后端：

   * 上传新图片到 Walrus → `newBlobId`
   * 调用 Move 的 `add_version(posterId, newBlobId, newTrustScore, timestamp)`
   * 返回新版本序号

5. 前端：

   * 更新当前展示为 **最新版本**
   * 在版本时间线中显示 V1、V2、V3…

---

#### 3.3 查看海报 & 验证

访问 `/poster/[posterId]`：

1. 前端调用 `GET /api/poster/get?posterId=xxx`
2. 后端从 Sui 查询 Poster 对象：

   * 拿到所有 versions
   * 取最后一个作为当前版本
3. 前端：

   * 显示当前版本海报（基于 Walrus URL）
   * 显示链上 TrustScore
   * 展示版本时间线（每个版本的时间 + score）
4. 如果用户点击某个历史版本：

   * 切换展示对应 blobId 的图和对应 score

---
