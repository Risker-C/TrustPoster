import { NextRequest, NextResponse } from "next/server";
import { fetchPosterFromChain } from "@/lib/sui";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const posterId = searchParams.get("posterId");

    if (!posterId) {
      return NextResponse.json(
        { success: false, error: "Poster ID is required" },
        { status: 400 }
      );
    }

    // 从链上获取 Poster 数据
    const poster = await fetchPosterFromChain(posterId);

    if (!poster) {
      return NextResponse.json(
        { success: false, error: "Poster not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: poster,
    });
  } catch (error) {
    console.error("Error fetching poster:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch poster" },
      { status: 500 }
    );
  }
}