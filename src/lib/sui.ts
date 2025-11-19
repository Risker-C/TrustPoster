import type { PosterDetail, PosterVersion } from "@/lib/types";

/**
 * Sui 链上操作封装
 * 当前是 mock 实现，未来会接入真实的 Sui.js 和 Move 合约
 */

/**
 * 在链上创建新的 Poster
 */
export async function createPosterOnChain(params: {
  blobId: string;
  trustScore: number;
  owner: string;
}): Promise<{ posterId: string }> {
  // 模拟交易延迟
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 生成 mock posterId
  const posterId = `poster-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  console.log("Mock creating poster on chain:", {
    blobId: params.blobId,
    trustScore: params.trustScore,
    owner: params.owner,
    resultPosterId: posterId,
  });

  // TODO: 未来实现：
  // 1. 配置 Sui 客户端
  // 2. 调用 Move 合约的 create_poster 函数
  // 3. 处理交易签名和提交
  // 4. 返回真实的对象 ID

  return { posterId };
}

/**
 * 为已有 Poster 添加新版本
 */
export async function addPosterVersionOnChain(params: {
  posterId: string;
  blobId: string;
  trustScore: number;
}): Promise<{ version: number }> {
  // 模拟交易延迟
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Mock 返回版本号（实际应该从链上获取）
  const version = Math.floor(Math.random() * 5) + 2; // 2-6

  console.log("Mock adding version to poster:", {
    posterId: params.posterId,
    blobId: params.blobId,
    trustScore: params.trustScore,
    newVersion: version,
  });

  // TODO: 未来实现：
  // 1. 获取 Poster 对象
  // 2. 调用 Move 合约的 add_version 函数
  // 3. 处理交易

  return { version };
}

/**
 * 从链上获取 Poster 详情
 */
export async function fetchPosterFromChain(posterId: string): Promise<PosterDetail | null> {
  // 模拟查询延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock 数据 - 如果是 demo 返回数据，其他返回 null
  if (posterId === "demo") {
    const versions: PosterVersion[] = [
      {
        version: 1,
        blobId: "blob-1234567890",
        trustScore: 85,
        createdAt: new Date("2024-01-15").toISOString(),
      },
      {
        version: 2,
        blobId: "blob-2345678901",
        trustScore: 88,
        createdAt: new Date("2024-02-20").toISOString(),
      },
      {
        version: 3,
        blobId: "blob-3456789012",
        trustScore: 92,
        createdAt: new Date("2024-03-10").toISOString(),
      },
    ];

    return {
      posterId,
      owner: "0x1234567890abcdef1234567890abcdef12345678",
      latestVersion: versions[versions.length - 1],
      versions,
    };
  }

  // TODO: 未来实现：
  // 1. 使用 Sui RPC 查询对象
  // 2. 解析 Move 对象数据
  // 3. 返回真实数据

  return null;
}

/**
 * 获取指定地址拥有的所有 Posters
 */
export async function fetchPostersByOwner(owner: string): Promise<PosterDetail[]> {
  // 模拟查询延迟
  await new Promise(resolve => setTimeout(resolve, 1500));

  // TODO: 实现真实的链上查询
  // 使用 Sui RPC 查询该地址拥有的 Poster 对象

  return [];
}