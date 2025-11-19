import { NextRequest, NextResponse } from "next/server";
import { generateBioFromGithub } from "@/lib/ai";
import type { GenerateBioInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { githubUrl, displayName, customBio } = body as GenerateBioInput;

    // 验证必填字段
    if (!githubUrl) {
      return NextResponse.json(
        { success: false, error: "GitHub URL is required" },
        { status: 400 }
      );
    }

    // 调用 AI 生成服务
    const result = await generateBioFromGithub({
      githubUrl,
      displayName,
      customBio,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error generating bio:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}