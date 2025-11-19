import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrustScoreBadge } from "@/components/poster/trust-score-badge";
import { VersionTimeline, type PosterVersion } from "@/components/poster/version-timeline";
import type { PosterDetail } from "@/lib/types";

// Mock 函数 - TODO: 替换为真实的链上数据获取
async function fetchPoster(posterId: string): Promise<PosterDetail | null> {
  // 模拟数据
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

  // 其他 posterId 返回 null
  return null;
}

export default async function PosterPage({
  params,
}: {
  params: { posterId: string };
}) {
  const poster = await fetchPoster(params.posterId);

  if (!poster) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* 标题区域 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Poster #{poster.posterId.slice(0, 10)}...</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Owner: {poster.owner.slice(0, 6)}...{poster.owner.slice(-4)}
              </span>
              <TrustScoreBadge score={poster.latestVersion.trustScore} />
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 海报预览区域 */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-700 h-full">
            <CardHeader>
              <CardTitle>海报预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-800 rounded-lg p-8 text-center">
                <div className="aspect-[3/4] bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-slate-400">
                    海报图片预览（未来用 Walrus 图片替换）
                  </p>
                </div>
                <p className="text-sm text-slate-500">
                  Blob ID: {poster.latestVersion.blobId}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 版本时间线 */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle>版本历史</CardTitle>
            </CardHeader>
            <CardContent>
              <VersionTimeline
                versions={poster.versions}
                currentVersion={poster.latestVersion.version}
                onSelectVersion={(version) => {
                  // TODO: 切换到选中的版本
                  console.log("Selected version:", version);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-center">
        <Link href={`/create?posterId=${poster.posterId}`}>
          <Button className="px-8 py-2">
            更新海报
          </Button>
        </Link>
      </div>
    </div>
  );
}