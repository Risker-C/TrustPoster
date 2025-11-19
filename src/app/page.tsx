import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-xl w-full bg-slate-900/50 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            TrustPoster
          </CardTitle>
          <CardDescription className="text-lg text-slate-300">
            AI × Web3 去中心化自我介绍海报
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2 text-slate-400">
            <p>
              使用 AI 生成专业简介，通过 Walrus 去中心化存储，
              <br />
              在 Sui 链上记录真实性，支持版本更新。
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/create">
              <Button className="w-full h-12 text-base font-semibold">
                开始生成海报
              </Button>
            </Link>

            <Link href="/poster/demo">
              <Button variant="outline" className="w-full h-12 text-base border-slate-600 text-slate-300 hover:bg-slate-800">
                查看示例海报
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-400">AI</div>
              <div className="text-xs text-slate-500">智能生成</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-400">Walrus</div>
              <div className="text-xs text-slate-500">去中心化存储</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-400">Sui</div>
              <div className="text-xs text-slate-500">链上验证</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}