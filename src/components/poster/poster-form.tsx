"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { PosterFormValues } from "@/lib/types";

const formSchema = z.object({
  githubUrl: z.string().url("请输入有效的 GitHub 链接"),
  displayName: z.string().optional(),
  customBio: z.string().optional(),
});

interface PosterFormProps {
  initialValues?: Partial<PosterFormValues>;
  loading?: boolean;
  onChange?: (values: PosterFormValues) => void;
  onGenerateWithAI?: (values: PosterFormValues) => void;
  onSubmit?: (values: PosterFormValues) => void;
  mode?: "create" | "update";
}

export function PosterForm({
  initialValues,
  loading = false,
  onChange,
  onGenerateWithAI,
  onSubmit,
  mode = "create",
}: PosterFormProps) {
  const form = useForm<PosterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubUrl: "",
      displayName: "",
      customBio: "",
      ...initialValues,
    },
  });

  // 监听表单变化
  const watchedValues = form.watch();

  React.useEffect(() => {
    if (onChange) {
      onChange(watchedValues);
    }
  }, [watchedValues, onChange]);

  const handleGenerateWithAI = (values: PosterFormValues) => {
    if (onGenerateWithAI) {
      onGenerateWithAI(values);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "创建新海报" : "更新海报"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub 链接 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username"
                      className="bg-slate-800 border-slate-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>显示名称</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="您的姓名"
                      className="bg-slate-800 border-slate-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>自定义简介</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="补充一些 AI 不知道的信息..."
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 pt-4">
              <Button
                type="button"
                onClick={() => handleGenerateWithAI(form.getValues())}
                disabled={loading || !form.getValues().githubUrl}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  "AI 生成简介"
                )}
              </Button>

              {onSubmit && (
                <Button
                  type="button"
                  onClick={() => onSubmit(form.getValues())}
                  disabled={loading || !form.getValues().githubUrl}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    mode === "create" ? "保存为草稿" : "保存更新"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}