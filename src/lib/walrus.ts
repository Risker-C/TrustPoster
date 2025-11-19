/**
 * Walrus 存储服务封装
 * 当前是 mock 实现，未来会接入真实的 Walrus SDK
 */

/**
 * 上传海报图片到 Walrus
 * @param file 图片文件 (PNG Blob)
 * @returns blobId
 */
export async function uploadPosterToWalrus(file: Blob): Promise<string> {
  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 生成一个 mock blobId
  const mockBlobId = `blob-${Date.now()}-${Math.random().toString(36).slice(2, 15)}`;

  console.log("Mock uploading to Walrus:", {
    fileName: "poster.png",
    fileSize: file.size,
    fileType: file.type,
  });

  // TODO: 未来实现：
  // 1. 接入 Walrus SDK 或 HTTP API
  // 2. 实现真实的文件上传
  // 3. 处理上传错误和重试机制
  // 4. 可能需要实现文件压缩/优化

  return mockBlobId;
}

/**
 * 获取 Walrus 中的文件 URL
 * @param blobId 文件 ID
 * @returns 文件访问 URL
 */
export function getWalrusFileUrl(blobId: string): string {
  // TODO: 替换为真实的 Walrus URL 格式
  return `https://walrus-devnet.walrus.ai/v1/blobs/${blobId}`;
}

/**
 * 从 Walrus 下载文件
 * @param blobId 文件 ID
 * @returns 文件 Blob
 */
export async function downloadFromWalrus(blobId: string): Promise<Blob> {
  // 模拟下载延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  // TODO: 使用真实的 Walrus API 下载
  // const response = await fetch(getWalrusFileUrl(blobId));
  // return response.blob();

  // 返回一个空的 mock blob
  return new Blob([], { type: "image/png" });
}