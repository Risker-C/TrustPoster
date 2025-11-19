import { NextRequest, NextResponse } from "next/server";
import { uploadPosterToWalrus } from "@/lib/walrus";
import { createPosterOnChain } from "@/lib/sui";
import type { PosterData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const posterData = body as PosterData;

    // 验证必填字段
    if (!posterData.githubUrl || !posterData.bio) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: 在真实实现中，这里需要：
    // 1. 将海报数据渲染成 HTML
    // 2. 使用 html2canvas 或类似工具转换为 PNG Blob
    // 3. 上传到 Walrus
    // 4. 在 Sui 上创建 Poster 对象

    // Mock 实现 - 生成一个假的图片 Blob
    const mockImageBlob = new Blob(["mock poster image data"], {
      type: "image/png",
    });

    // 上传到 Walrus (mock)
    const blobId = await uploadPosterToWalrus(mockImageBlob);

    // 在链上创建 Poster (mock)
    // TODO: 从请求中获取真实的钱包地址
    const mockOwnerAddress = "0x1234567890abcdef1234567890abcdef12345678";
    const posterResult = await createPosterOnChain({
      blobId,
      trustScore: posterData.trustScore || 0,
      owner: mockOwnerAddress,
    });

    return NextResponse.json({
      success: true,
      data: {
        posterId: posterResult.posterId,
        blobId,
        trustScore: posterData.trustScore,
      },
    });
  } catch (error) {
    console.error("Error creating poster:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create poster" },
      { status: 500 }
    );
  }
}