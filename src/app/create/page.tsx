"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PosterForm } from "@/components/poster/poster-form";
import { PosterPreview } from "@/components/poster/poster-preview";
import type { PosterData, PosterFormValues } from "@/lib/types";

export default function CreatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const posterId = searchParams.get("posterId");
  const [mode, setMode] = useState<"create" | "update">("create");
  const [posterData, setPosterData] = useState<PosterData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (posterId) {
      setMode("update");
      // TODO: 加载现有海报数据
      console.log("Update mode for poster:", posterId);
    }
  }, [posterId]);

  const handleFormChange = (values: PosterFormValues) => {
    setPosterData(prev => ({
      ...prev,
      ...values,
    }));
  };

  const handleGenerateWithAI = async (values: PosterFormValues) => {
    if (!values.githubUrl) return;

    setLoading(true);
    try {
      const response = await fetch("/api/generate/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const result = await response.json();
        const aiData = result.data;

        setPosterData(prev => ({
          ...prev!,
          ...values,
          bio: aiData.bio,
          skills: aiData.skills,
          highlights: aiData.highlights,
          trustScore: aiData.trustScore,
        }));
      } else {
        console.error("Failed to generate bio");
      }
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!posterData) return;

    setLoading(true);
    try {
      const endpoint = mode === "create" ? "/api/poster/create" : "/api/poster/update";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...posterData,
          ...(mode === "update" && { posterId }),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/poster/${result.data.posterId}`);
      } else {
        console.error("Failed to publish poster");
      }
    } catch (error) {
      console.error("Publish failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          {mode === "create" ? "创建新海报" : "更新海报"}
        </h1>
        <p className="text-slate-400">
          {mode === "create"
            ? "输入您的 GitHub 信息，AI 将为您生成专业的个人简介海报"
            : "基于现有海报创建新版本"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PosterForm
          initialValues={posterData || undefined}
          loading={loading}
          mode={mode}
          onChange={handleFormChange}
          onGenerateWithAI={handleGenerateWithAI}
        />

        <PosterPreview
          data={posterData}
          mode={mode}
          loading={loading}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}