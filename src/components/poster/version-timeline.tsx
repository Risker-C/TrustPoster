"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

export interface PosterVersion {
  version: number;
  blobId: string;
  trustScore: number;
  createdAt: string; // ISO string
}

interface VersionTimelineProps {
  versions: PosterVersion[];
  currentVersion?: number;
  onSelectVersion?: (version: number) => void;
}

export function VersionTimeline({
  versions,
  currentVersion,
  onSelectVersion,
}: VersionTimelineProps) {
  if (!versions || versions.length === 0) {
    return (
      <Card className="p-4 text-center text-slate-500">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>暂无历史版本</p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-3">
      {versions.map((version) => (
        <Card
          key={version.version}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            version.version === currentVersion
              ? "bg-blue-600/10 border-blue-600"
              : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
          }`}
          onClick={() => onSelectVersion?.(version.version)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                V{version.version}
              </span>
              {version.version === currentVersion && (
                <Badge variant="secondary" className="text-xs">
                  当前
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3 w-3" />
              {formatDate(version.createdAt)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">信任分数</span>
              <span className={`font-bold ${getTrustScoreColor(version.trustScore)}`}>
                {version.trustScore}
              </span>
            </div>

            <div className="text-xs text-slate-500">
              Blob ID: {version.blobId.slice(0, 10)}...{version.blobId.slice(-6)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}