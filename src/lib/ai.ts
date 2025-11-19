import type { GenerateBioInput, GenerateBioResult } from "@/lib/types";

/**
 * 从 GitHub URL 或用户名生成 AI 简介
 * 当前是 mock 实现，未来会接入真实的 GitHub API 和 LLM
 */
export async function generateBioFromGithub(
  input: GenerateBioInput
): Promise<GenerateBioResult> {
  // 解析 GitHub 用户名
  const username = extractUsernameFromUrl(input.githubUrl);

  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock 数据 - 根据用户名生成一些伪随机内容
  const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const mockBios = [
    `${username} 是一位充满激情的全栈开发者，专注于 Web3 和去中心化应用开发。热衷于构建透明、可信的数字基础设施。`,
    `${username} 是 Web3 生态系统中的活跃贡献者，专注于智能合约开发和去中心化治理。 believes in the power of decentralization.`,
    `${username} 是一名经验丰富的区块链开发者，擅长 DeFi 协议设计和智能合约安全审计。致力于推动去中心化金融的普及。`,
    `${username} 是全栈工程师兼 Web3 爱好者，专注于构建用户友好的区块链应用。passionate about bridging the gap between Web2 and Web3.`,
    `${username} 是去中心化系统的倡导者，专注于分布式存储和计算。building the future of decentralized infrastructure.`,
  ];

  const mockSkills = [
    ["Solidity", "React", "TypeScript", "Hardhat", "Ethers.js"],
    ["Rust", "Move", "Sui", "TypeScript", "Next.js"],
    ["Solidity", "DeFi", "ZK-SNARKs", "TypeScript", "Node.js"],
    ["React", "Web3.js", "Ethers.js", "Smart Contracts", "IPFS"],
    ["TypeScript", "Go", "Docker", "Kubernetes", "Blockchain"],
  ];

  const mockHighlights = [
    "贡献了多个开源 DeFi 协议，总 TVL 超过 $10M",
    "在 GitHub 上维护着 5+ 个活跃的开源项目",
    "Sui 生态系统早期贡献者",
    "发表过多篇 Web3 技术文章",
    "参与过多个知名项目的智能合约审计",
    "构建了被数万用户使用的 Web3 工具",
    "在 EthGlobal 黑客松中多次获奖",
    "Web3 领域的技术布道师",
  ];

  // 生成结果
  const bio = input.customBio
    ? `${input.customBio} ${mockBios[hash % mockBios.length]}`
    : mockBios[hash % mockBios.length];

  const skills = mockSkills[hash % mockSkills.length];

  const highlights = mockHighlights
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + (hash % 3));

  // 生成 60-98 之间的信任分数
  const trustScore = 60 + (hash % 39);

  // TODO: 未来实现：
  // 1. 调用 GitHub API 获取真实数据
  // 2. 调用 LLM (如 GPT-4/Claude) 生成内容
  // 3. 基于真实数据计算 TrustScore

  return {
    bio,
    skills,
    highlights,
    trustScore,
  };
}

/**
 * 从 GitHub URL 提取用户名
 */
function extractUsernameFromUrl(url: string): string {
  const match = url.match(/github\.com\/([^\/]+)/);
  if (match) {
    return match[1];
  }

  // 如果不是完整 URL，假设直接是用户名
  return url.replace(/[@\/]/g, "").trim();
}