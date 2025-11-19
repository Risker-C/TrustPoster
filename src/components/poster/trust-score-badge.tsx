"use client";

import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";

interface TrustScoreBadgeProps {
  score?: number;
}

export function TrustScoreBadge({ score }: TrustScoreBadgeProps) {
  if (score === undefined || score === null) {
    return (
      <Badge variant="outline" className="bg-slate-800/50 text-slate-400">
        <Shield className="h-4 w-4 mr-1" />
        未评分
      </Badge>
    );
  }

  const getScoreConfig = (score: number) => {
    if (score >= 70) {
      return {
        variant: "default" as const,
        className: "bg-green-600/20 text-green-400 border-green-600/30",
        icon: ShieldCheck,
        label: "高",
      };
    } else if (score >= 40) {
      return {
        variant: "secondary" as const,
        className: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
        icon: Shield,
        label: "中",
      };
    } else {
      return {
        variant: "destructive" as const,
        className: "bg-red-600/20 text-red-400 border-red-600/30",
        icon: ShieldAlert,
        label: "低",
      };
    }
  };

  const config = getScoreConfig(score);
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Badge className={config.className} variant={config.variant}>
        <Icon className="h-4 w-4 mr-1" />
        TrustScore: {score}
      </Badge>
      <span className="text-xs text-slate-500">({config.label})</span>
    </div>
  );
}