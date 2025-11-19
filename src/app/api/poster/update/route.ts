import { NextRequest, NextResponse } from "next/server";
import { uploadPosterToWalrus } from "@/lib/walrus";
import { addPosterVersionOnChain } from "@/lib/sui";
import type { PosterData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { posterId, ...posterData } = body as PosterData & { posterId: string };

    // 验证必填字段
    if (!posterId) {
      return NextResponse.json(
        { success: false, error: "Poster ID is required" },
        { status: 400 }
      );
    }

    if (!posterData.githubUrl || !posterData.bio) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: 在真实实现中：
    // 1. 渲染新的海报图片
    // 2. 上传到 Walrus
    // 3. 在链上添加新版本

    // Mock 实现
    const mockImageBlob = new Blob(["updated poster image data"], {
      type: "image/png",
    });

    // 上传新图片到 Walrus
    const newBlobId = await uploadPosterToWalrus(mockImageBlob);

    // 在链上添加新版本
    const versionResult = await addPosterVersionOnChain({
      posterId,
      blobId: newBlobId,
      trustScore: posterData.trustScore || 0,
    });

    return NextResponse.json({
      success: true,
      data: {
        version: versionResult.version,
        blobId: newBlobId,
        trustScore: posterData.trustScore,
      },
    });
  } catch (error) {
    console.error("Error updating poster:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update poster" },
      { status: 500 }
    );
  }
}