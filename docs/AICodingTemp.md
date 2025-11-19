## 一、推荐 Next.js 代码结构

你可以参考下面的目录树来搭：

```text
src/
  app/
    layout.tsx
    page.tsx                     // Landing 首页
    create/
      page.tsx                   // 创建/更新海报页
    poster/
      [posterId]/
        page.tsx                 // 海报展示 + 版本历史
    api/
      generate/
        bio/
          route.ts               // POST /api/generate/bio
      poster/
        create/
          route.ts               // POST /api/poster/create
        update/
          route.ts               // POST /api/poster/update
        get/
          route.ts               // GET /api/poster/get?posterId=xxx
  components/
    layout/
      site-header.tsx
      site-footer.tsx
    poster/
      poster-form.tsx
      poster-preview.tsx
      trust-score-badge.tsx
      version-timeline.tsx
    wallet/
      wallet-connect.tsx
  lib/
    ai.ts                        // GitHub + LLM 交互封装
    walrus.ts                    // Walrus 上传封装
    sui.ts                       // Sui 链上操作封装
    poster.ts                    // Poster 领域逻辑（组装/解析）
    types.ts                     // 公共类型定义
  styles/
    globals.css
  move/                          // 非 Next.js 目录，用来放 Move 合约工程
    (后面自己按 Sui CLI 生成)
```

---

## 二、AI Coding 指令模板（逐文件）

> 用法：
> 对着某个文件，在 AI Coding 工具里新开对话，**把下面对应的 Prompt 整段复制进去**，
> AI 就会为你生成这个文件的代码（你可以再手动微调）。

我会按以下顺序给你模板：

1. `src/app/layout.tsx`
2. `src/app/page.tsx`
3. `src/app/create/page.tsx`
4. `src/app/poster/[posterId]/page.tsx`
5. `src/components/poster/poster-form.tsx`
6. `src/components/poster/poster-preview.tsx`
7. `src/components/poster/trust-score-badge.tsx`
8. `src/components/poster/version-timeline.tsx`
9. `src/components/wallet/wallet-connect.tsx`
10. `src/lib/types.ts`
11. `src/lib/ai.ts`
12. `src/lib/walrus.ts`
13. `src/lib/sui.ts`
14. `src/lib/poster.ts`
15. API 路由 `route.ts` 模板（3 个）

你可以根据时间优先生成前端 UI + 简单 mock，后面再换成真链上逻辑。

---

### 1️⃣ `src/app/layout.tsx`

```txt
你是一个精通 Next.js 14 App Router 和 shadcn/ui 的前端工程师。

请为文件 `src/app/layout.tsx` 编写代码，要求：

1. 使用 TypeScript 和 React 18。
2. 使用 `children: React.ReactNode` 作为布局入口。
3. 导入全局样式 `../styles/globals.css`（如果路径不同请自行适配）。
4. 在 <body> 内包一层主布局容器：
   - 使用 Tailwind 类：`min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50`
   - 上方预留一个站点头部 Slot（后续 header 组件会插入），可以先简单留个 `<header>` 占位。
   - 主内容用 `<main className="container mx-auto px-4 py-8">` 包裹 children。
5. 页面语言设置为 `lang="en"`。
6. 导出 `metadata`，包含：
   - title: "TrustPoster"
   - description: "AI-powered Web3 decentralized self-introduction poster with Walrus + Sui"

请直接返回完整的 layout.tsx 代码。
```

---

### 2️⃣ `src/app/page.tsx`（Landing 首页）

```txt
你是一个前端工程师，请为 `src/app/page.tsx` 编写 Next.js App Router 首页页面组件，要求：

1. 使用 TypeScript，默认导出一个 Server Component：`export default function HomePage()`.
2. 使用 shadcn/ui 的组件（假设已通过 CLI 添加）：
   - Card, CardHeader, CardTitle, CardDescription, CardContent
   - Button
3. 页面内容：
   - 标题：TrustPoster
   - 副标题：AI × Web3 去中心化自我介绍海报
   - 简短描述：说明项目用 AI 生成简介，用 Walrus 存储，用 Sui 记录真实性，并支持海报可更新（版本历史）。
   - 一个主要 Button：“开始生成海报”，点击后跳转到 `/create`。
   - 一个次级 Button：“查看示例海报”，可以跳转到 `/poster/demo`（先写假链接即可）。
4. 使用 Tailwind 布局：
   - 让 Card 居中：外层使用 `flex items-center justify-center min-h-[60vh]`.
   - Card 使用适度的 max-w 值，例如 `max-w-xl w-full`.
5. 样式风格偏 Web3：可以加一些简单的渐变文字或背景类，但不要过度复杂。

请直接生成完整的 page.tsx 代码。
```

---

### 3️⃣ `src/app/create/page.tsx`（创建/更新海报页）

```txt
你是一个 Next.js + shadcn/ui + React Hook Form 的专家。

请为 `src/app/create/page.tsx` 编写代码，要求：

1. 这是一个 Client Component，文件顶部加 `"use client"`.
2. 使用：
   - React hooks（useState, useEffect）
   - `PosterForm` 和 `PosterPreview` 组件（从 `@/components/poster` 下导入）
   - （后续我们会实现这些组件，这里只需假设存在）
3. 页面职责：
   - 作为海报创建/更新的容器页面。
   - 读取 URL 搜索参数 `posterId`（如果有，说明是“更新模式”；否则是“创建模式”）。
     - 可使用 `useSearchParams`。
   - 内部维护两个主要状态：
     - `posterData`：当前正在编辑/预览的海报数据（类型可以先用 `PosterData` 接口，从 `@/lib/types` 导入，若不存在则先声明一个简化类型）。
     - `mode`：`"create"` 或 `"update"`，根据是否有 posterId 判断。
   - 渲染结构：
     - 顶部一个简单的标题区域：显示“创建新海报”或“更新海报”。
     - 左侧显示 `PosterForm`，右侧显示 `PosterPreview`，在 >= md 屏幕时使用两栏布局。
4. 与 PosterForm 交互：
   - 向 PosterForm 传入 `initialData`（可选）和 `onChange` 回调。
   - 当 PosterForm 表单变化时，通过 onChange 更新 `posterData`。
   - PosterForm 提交成功时（例如用户点击“AI 生成简介”或“生成海报”），可以通过回调通知父组件。
5. 与 PosterPreview 交互：
   - 将 `posterData` 传入 PosterPreview，用于展示当前预览效果。
   - 传入一个 `onSubmit` 或 `onPublish` 回调函数，当用户点击“上链并发布”按钮时：
     - 调用 `/api/poster/create` 或 `/api/poster/update` 接口（可以先写 TODO 或简单的 fetch 占位）。
     - 成功后跳转到 `/poster/[posterId]`，其中 posterId 从接口返回。
6. 布局和样式：
   - 最外层 div 使用 `space-y-6`。
   - 表单 + 预览布局在大屏用 `grid grid-cols-1 md:grid-cols-2 gap-6`。
   - 保持代码简洁清晰，逻辑用注释标出 TODO 的地方。

请输出完整的 `page.tsx` 代码，允许使用简单的占位类型和 TODO 注释。
```

---

### 4️⃣ `src/app/poster/[posterId]/page.tsx`（海报展示页）

```txt
你是一个 Next.js 14 App Router 开发者。

请为 `src/app/poster/[posterId]/page.tsx` 编写一个 Server Component 页面，要求：

1. 使用动态路由参数 `posterId`，通过 `params: { posterId: string }` 获取。
2. 页面职责：
   - 根据 `posterId` 显示对应的海报详情。
   - 包括：当前最新版本海报、版本时间线、基本信息（owner、trustScore、createdAt 等）。
3. 数据来源（当前阶段可以先 mock）：
   - 定义一个 `async function fetchPoster(posterId: string)`，暂时返回一个模拟对象：
     - posterId: string
     - owner: "0x1234...abcd"
     - latestVersion: { version: number; blobId: string; trustScore: number; createdAt: string; }
     - versions: 数组，包含若干版本（例如 2~3 个），每个版本包含 version、blobId、trustScore、createdAt。
   - 未来我们会用 Sui RPC + Walrus URL 替换。
4. UI 结构：
   - 使用 shadcn/ui 的 Card 布局。
   - 上半部分：
     - 标题：`Poster #{posterId}`（可以截断显示）。
     - 显示 owner 地址（简短格式）。
     - 显示最新版本的 TrustScore（可以用 `TrustScoreBadge` 组件，假设从 `@/components/poster/trust-score-badge` 导入）。
   - 中间部分：
     - 左侧区域：展示海报图片占位（可以用一个空 div + “海报图片预览（未来用 Walrus 图片替换）”的文字）。
     - 右侧区域：版本时间线列表，使用 `VersionTimeline` 组件（假设从 `@/components/poster/version-timeline` 导入），传入 versions。
   - 底部：
     - 提供一个“更新海报”按钮，指向 `/create?posterId=xxx`。
5. 样式布局：
   - 整体使用 `space-y-6`。
   - 海报预览 + 时间线区域用 `grid grid-cols-1 lg:grid-cols-3 gap-6`，其中：
     - 左侧占 2 列（海报预览）
     - 右侧占 1 列（版本列表）
6. 尽量保持代码简洁，并为未来接入真实数据留好 TODO 注释。

请返回完整的 `page.tsx` 代码。
```

---

### 5️⃣ `src/components/poster/poster-form.tsx`

````txt
你是一个熟练使用 React Hook Form + Zod + shadcn/ui 的前端开发者。

请为 `src/components/poster/poster-form.tsx` 编写一个可复用的表单组件，要求：

1. `"use client"` 组件。
2. 使用：
   - `react-hook-form`
   - `@hookform/resolvers/zod`
   - `zod`
   - shadcn/ui 的 `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `Input`, `Textarea`, `Button`, `Card` 等。
3. 定义一个 `PosterFormValues` 类型或 zod schema，字段包括：
   - `githubUrl: string`（必填）
   - `displayName: string`（可选，用户自定义显示名称）
   - `customBio: string`（可选，用户自定义简介，会和 AI 结果结合）
4. 组件 Props：
   ```ts
   interface PosterFormProps {
     initialValues?: Partial<PosterFormValues>;
     loading?: boolean;
     onChange?: (values: PosterFormValues) => void;
     onGenerateWithAI?: (values: PosterFormValues) => void; // 点击“AI 生成简介”
     onSubmit?: (values: PosterFormValues) => void;         // 点击“生成海报 / 发布”
     mode?: "create" | "update";
   }
````

5. 表单 UI：

   * 标题根据 mode 显示“创建新海报”或“更新海报”。
   * 字段布局：

     * GitHub 链接输入框
     * 显示名称输入框
     * 自定义简介 Textarea
   * 按钮：

     * “AI 生成简介”按钮：点击时调用 `onGenerateWithAI`（如果存在），传当前表单值。
     * “保存为海报草稿”或“生成海报”按钮：提交表单，调用 `onSubmit`。
6. onChange 行为：

   * 每次字段变动时，如果传入了 onChange，则调用并传递当前 `form.getValues()`。
7. 使用 Card 包裹整个表单，样式尽量整洁简洁。

请生成完整的 `poster-form.tsx` 代码。

````

---

### 6️⃣ `src/components/poster/poster-preview.tsx`

```txt
你是一个前端 UI 组件开发者，请为 `src/components/poster/poster-preview.tsx` 编写组件，要求：

1. `"use client"` 组件。
2. 接收 Props：
   ```ts
   import type { PosterData } from "@/lib/types";

   interface PosterPreviewProps {
     data?: PosterData | null;      // 当前预览数据，允许为空（未填写时）
     mode?: "create" | "update";
     loading?: boolean;             // 上传/上链中
     onPublish?: () => void;        // 点击“上链并发布”的回调
   }
````

3. PosterData 类型可以假设包含：

   * displayName?: string
   * githubUrl: string
   * bio?: string
   * skills?: string\[]
   * trustScore?: number
   * highlights?: string\[]
4. UI 要求：

   * 使用 shadcn/ui 的 Card 组件。
   * 顶部区域：

     * 标题：显示 displayName 或 “未命名海报”
     * 副标题：显示 githubUrl（可截断）
   * 中部：模拟海报区域（未来会用于转成图片）

     * 使用一个 div 包裹，添加边框、背景、内边距，模拟真实海报布局。
     * 显示：

       * Bio 文本
       * Skills 标签列表（可以使用简单的 span 样式）
       * TrustScore，使用 `TrustScoreBadge` 子组件（假设已从 `@/components/poster/trust-score-badge` 导入）。
   * 底部区域：

     * 显示当前模式（创建 or 更新）
     * 如果传入了 onPublish，则显示一个主按钮：“上链并发布海报”
     * 按钮 disabled 时机：`loading` 为 true 或 data 不完整（例如没有 githubUrl）。
5. 对于 data 为空的情况：

   * 显示占位文案，如：“请在左侧表单中填写信息，或点击 AI 生成简介，即可预览海报。”。

请返回完整的 `poster-preview.tsx` 代码。

````

---

### 7️⃣ `src/components/poster/trust-score-badge.tsx`

```txt
你是一个 UI 组件工程师，请为 `src/components/poster/trust-score-badge.tsx` 实现一个小巧的信任分数徽章组件：

1. 使用 `"use client"`。
2. Props：
   ```ts
   interface TrustScoreBadgeProps {
     score?: number; // 0-100，可为空（为空则显示“未评分”）
   }
````

3. 使用 shadcn/ui 的 Badge 组件（假设路径为 `@/components/ui/badge`）。
4. 行为：

   * 如果 score 为 undefined 或 null，显示：灰色风格的 Badge 文案“未评分”。
   * 如果 score 有值：

     * 显示文案：`TrustScore: {score}`
     * 根据区间设置不同外观（可以控制 variant 或 className）：

       * 0-39：红色/“低”
       * 40-69：黄色/“中”
       * 70-100：绿色/“高”
5. 文件中导出：

   * `export function TrustScoreBadge(...) { ... }`.

请生成完整代码。

````

---

### 8️⃣ `src/components/poster/version-timeline.tsx`

```txt
你是一个擅长信息可视化的前端开发者，请为 `src/components/poster/version-timeline.tsx` 实现一个版本时间线组件：

1. `"use client"` 组件。
2. Props：
   ```ts
   interface PosterVersion {
     version: number;
     blobId: string;
     trustScore: number;
     createdAt: string; // ISO 字符串
   }

   interface VersionTimelineProps {
     versions: PosterVersion[];
     currentVersion?: number;                // 当前展示中的版本号
     onSelectVersion?: (version: number) => void;
   }
````

3. UI 要求：

   * 每个版本用一个 Card 或 ListItem 展示：

     * 标题：`版本 V{version}`
     * 副标题：时间（格式化为可读形式）、TrustScore
     * 显示简短的 blobId（例如前 6 后 4 字符）。
   * 当前版本高亮，可以用边框或背景区分。
   * 当点击一个版本项时，调用 `onSelectVersion(version)`。
4. 布局：

   * 适合在窄列中展示（比如右侧 1/3 宽度）。
   * 使用 `space-y-2` 或 `divide-y` 组织列表。
5. 如果 versions 为空：

   * 显示“暂无历史版本”。

请输出完整的 `version-timeline.tsx` 代码。

````

---

### 9️⃣ `src/components/wallet/wallet-connect.tsx`

```txt
你是一个熟悉 Sui Wallet Kit 的前端开发者，请为 `src/components/wallet/wallet-connect.tsx` 编写一个简单的钱包连接组件。

要求：

1. `"use client"` 组件。
2. 使用 @mysten/wallet-kit（假设已经安装），例如：
   - `useCurrentAccount`
   - `ConnectButton` 等（如果不确定 API，可以使用 TODO 标注，先写出大致结构）。
3. Props：
   ```ts
   interface WalletConnectProps {
     onConnected?: (address: string) => void;
   }
````

4. 行为：

   * 如果未连接钱包：

     * 显示一个主按钮：“连接 Sui 钱包”
   * 如果已连接：

     * 显示地址简写（例如 0x1234...abcd）
     * 可选：显示一个“断开”按钮或只是显示状态。
   * 当连接成功时，如果传入了 onConnected，则调用并传入当前地址。
5. 使用 shadcn/ui 的 Button 包装交互按钮，与应用整体风格一致。
6. 保留 TODO：未来完善 Wallet Kit 实际调用逻辑，目前可以用假数据或注释说明。

请生成完整的 `wallet-connect.tsx` 文件代码。

````

---

### 🔟 `src/lib/types.ts`（类型定义）

```txt
你是一个 TypeScript 设计师，请为 `src/lib/types.ts` 定义基础类型。

要求定义至少以下类型：

1. `PosterData`：
   ```ts
   export interface PosterData {
     githubUrl: string;
     displayName?: string;
     bio?: string;
     skills?: string[];
     highlights?: string[];
     trustScore?: number;
   }
````

2. `PosterVersion`：

   ```ts
   export interface PosterVersion {
     version: number;
     blobId: string;
     trustScore: number;
     createdAt: string; // ISO
   }
   ```
3. `PosterDetail`：

   ```ts
   export interface PosterDetail {
     posterId: string;
     owner: string;
     latestVersion: PosterVersion;
     versions: PosterVersion[];
   }
   ```

可以根据需要适当扩展，但请保持简洁并导出所有类型。

````

---

### 1️⃣1 `src/lib/ai.ts`（AI + GitHub 封装，先 mock）

```txt
你是一个后端/全栈开发者，请为 `src/lib/ai.ts` 编写一个用于 AI 内容生成的封装模块（当前可以先 mock，后续再接真实 AI）。

要求：

1. 使用 TypeScript。
2. 从 `@/lib/types` 导入 `PosterData` 类型。
3. 导出一个函数：
   ```ts
   export interface GenerateBioInput {
     githubUrl: string;
     displayName?: string;
     customBio?: string;
   }

   export interface GenerateBioResult {
     bio: string;
     skills: string[];
     highlights: string[];
     trustScore: number; // 0-100
   }

   export async function generateBioFromGithub(input: GenerateBioInput): Promise<GenerateBioResult> { ... }
````

4. 当前实现可以先使用 mock 数据：

   * 简单解析 githubUrl 得到 username。
   * 返回固定结构的内容，例如：

     * bio: `"{username} is a Web3 developer ..."`
     * skills: \["Solidity", "React", "Sui"]
     * highlights: 3\~4 条占位内容
     * trustScore: 随机 70\~95 之间。
5. 保留 TODO 注释：说明未来会替换为真实 GitHub API + LLM 调用。

请输出完整的 `ai.ts` 代码。

````

---

### 1️⃣2 `src/lib/walrus.ts`（Walrus 上传封装，先占位）

```txt
你是一个 Web3/存储方向的开发者，请为 `src/lib/walrus.ts` 编写 Walrus 上传封装（当前可以使用假实现）。

要求：

1. 使用 TypeScript。
2. 导出一个函数：
   ```ts
   export async function uploadPosterToWalrus(file: Blob): Promise<string> { ... }
````

3. 逻辑：

   * 当前阶段先不接真实 SDK，可以用 setTimeout 模拟网络延迟。
   * 返回一个类似 `mock-blob-${Math.random().toString(36).slice(2, 10)}` 的字符串作为 blobId。
4. 添加 TODO 注释，描述未来需要：

   * 接入 Walrus SDK 或 HTTP 上传接口。
   * 处理错误重试与超时等。

请直接生成完整的 `walrus.ts` 代码。

````

---

### 1️⃣3 `src/lib/sui.ts`（Sui 链上操作封装，先占位）

```txt
你是一个 Sui dApp 开发者，请为 `src/lib/sui.ts` 编写链上交互封装（当前先写假实现，未来再接真实 Sui.js 调用）。

要求：

1. 使用 TypeScript。
2. 从 `@/lib/types` 导入需要的类型。
3. 至少导出以下函数：
   ```ts
   export async function createPosterOnChain(params: {
     blobId: string;
     trustScore: number;
     owner: string;
   }): Promise<{ posterId: string }> { ... }

   export async function addPosterVersionOnChain(params: {
     posterId: string;
     blobId: string;
     trustScore: number;
   }): Promise<void> { ... }

   export async function fetchPosterFromChain(posterId: string): Promise<PosterDetail | null> { ... }
````

4. 当前实现可以使用内存模拟或简单的 mock：

   * createPosterOnChain 返回一个 `posterId`：`mock-poster-${随机字符串}`。
   * addPosterVersionOnChain 目前只打印日志。
   * fetchPosterFromChain 返回一个模拟的 PosterDetail：

     * posterId 为传入值
     * owner 为 "0xmockowner..."
     * versions 数组包含若干虚构版本，方便在前端展示版本时间线。
5. 添加 TODO 注释：未来接入真实 Sui RPC / Sui.js 与 Move 合约。

请生成完整的 `sui.ts` 代码。

````

---

### 1️⃣4 `src/lib/poster.ts`（业务逻辑辅助）

```txt
你是一个后端/领域建模开发者，请为 `src/lib/poster.ts` 编写一些与 Poster 相关的工具函数。

1. 从 `@/lib/types` 导入 `PosterData`, `PosterVersion`, `PosterDetail`。
2. 至少实现：
   - `buildPosterDataFromAI(input: GenerateBioInput, aiResult: GenerateBioResult): PosterData`
   - `getLatestVersion(versions: PosterVersion[]): PosterVersion | null`
3. 其中 `GenerateBioInput` 和 `GenerateBioResult` 类型从 `./ai` 导入。
4. 函数内部可以是简单的数据组装与数组操作，但要保持类型严谨。

请输出完整的 `poster.ts` 内容。
````

---

### 1️⃣5 API 路由模板（以 `/api/generate/bio/route.ts` 为例）

你可以照这个模板生成三个 API：

* `/api/generate/bio/route.ts`
* `/api/poster/create/route.ts`
* `/api/poster/update/route.ts`

#### `/api/generate/bio/route.ts`

```txt
你是一个 Next.js App Router API 路由开发者，请为 `src/app/api/generate/bio/route.ts` 编写代码：

1. 使用 `NextRequest` 和 `NextResponse`。
2. 支持 `POST` 方法：
   - 请求 body 是 JSON，包含：
     - `githubUrl`: string
     - `displayName?`: string
     - `customBio?`: string
   - 使用 `generateBioFromGithub`（从 `@/lib/ai` 导入）生成结果。
   - 返回 JSON：`{ bio, skills, highlights, trustScore }`。
3. 加基础错误处理：
   - 无效 body 或解析失败 → 返回 400。
   - 内部错误 → 返回 500，并在 console 中打印错误。

请输出完整的 `route.ts`。
```

---

## 最后怎么用这些模板？

建议开发顺序：

1. 先生成：`layout.tsx`、首页、`/create` 页面、`poster-form`、`poster-preview`、`types.ts`、`ai.ts`（mock）
2. 再生成：`/api/generate/bio` 路由，打通 AI mock 流程
3. 然后：`walrus.ts`、`sui.ts` mock + `/api/poster/create`、`/poster/[posterId]` 页面 + `version-timeline`
4. 最后再逐步把 Walrus / Sui mock 替换为真实逻辑
