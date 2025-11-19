"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download } from "lucide-react";
import type { PosterData } from "@/lib/types";
import { TrustScoreBadge } from "./trust-score-badge";

interface PosterPreviewProps {
  data?: PosterData | null;
  mode?: "create" | "update";
  loading?: boolean;
  onPublish?: () => void;
}

export function PosterPreview({
  data,
  mode = "create",
  loading = false,
  onPublish,
}: PosterPreviewProps) {
  const posterRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!posterRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: "#1e293b",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = "trust-poster.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (!data) {
    return (
      <Card className="bg-slate-900/50 border-slate-700 h-full">
        <CardHeader>
          <CardTitle>海报预览</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-slate-500 text-center">
            请在左侧表单中填写信息，<br />
            或点击 AI 生成简介，<br />
            即可预览海报。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>海报预览</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownloadImage}
          className="text-slate-400 hover:text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          下载
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 海报主体 */}
        <div
          ref={posterRef}
          className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-lg border border-slate-700"
        >
          {/* 头部信息 */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {data.displayName || "未命名海报"}
            </h1>
            <p className="text-slate-400 text-sm">
              {data.githubUrl.replace("https://github.com/", "@")}
            </p>
          </div>

          {/* 简介区域 */}
          {data.bio && (
            <div className="mb-6 text-center">
              <p className="text-lg text-slate-200 leading-relaxed">
                {data.bio}
              </p>
            </div>
          )}

          {/* 技能标签 */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">技能栈</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {data.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 亮点成就 */}
          {data.highlights && data.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">亮点成就</h3>
              <ul className="space-y-2">
                {data.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-400 mr-2">▸</span>
                    <span className="text-sm text-slate-300">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 信任分数 */}
          <div className="flex justify-center mt-8">
            <TrustScoreBadge score={data.trustScore} />
          </div>

          {/* 底部信息 */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-500">
              Powered by TrustPoster | AI × Web3
            </p>
          </div>
        </div>

        {/* 发布按钮 */}
        {onPublish && (
          <Button
            onClick={onPublish}
            disabled={loading || !data.githubUrl}
            className="w-full h-12 text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                发布中...
              </>
            ) : (
              mode === "create" ? "上链并发布海报" : "更新海报版本"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}