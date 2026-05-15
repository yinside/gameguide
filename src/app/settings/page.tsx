"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Key, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure your CMS platform settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-gaming-red" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                DeepSeek API Key (Recommended)
              </Label>
              <Input
                type="password"
                placeholder="sk-..."
                className="bg-gaming-bg border-gaming-border text-white"
                defaultValue=""
                onChange={() => {
                  toast.info("API key would be stored securely in production");
                }}
              />
              <p className="text-[10px] text-muted-foreground">
                Primary AI provider. Set via DEEPSEEK_API_KEY env var.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                OpenAI API Key (Alternative)
              </Label>
              <Input
                type="password"
                placeholder="sk-..."
                className="bg-gaming-bg border-gaming-border text-white"
                defaultValue=""
                onChange={() => {
                  toast.info("API key would be stored securely in production");
                }}
              />
              <p className="text-[10px] text-muted-foreground">
                Fallback AI provider. Set via OPENAI_API_KEY env var.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                GitHub Token
              </Label>
              <Input
                type="password"
                placeholder="ghp_..."
                className="bg-gaming-bg border-gaming-border text-white"
                defaultValue=""
              />
              <p className="text-[10px] text-muted-foreground">
                Global token for GitHub publishing. Override per site.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Vercel Token
              </Label>
              <Input
                type="password"
                placeholder="vercel_token..."
                className="bg-gaming-bg border-gaming-border text-white"
                defaultValue=""
              />
              <p className="text-[10px] text-muted-foreground">
                For triggering deployments. Set via VERCEL_TOKEN env var.
              </p>
            </div>
            <Button className="w-full bg-gaming-red hover:bg-gaming-red-hover text-white">
              Save Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-gaming-red" />
              Platform Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gaming-bg rounded-lg border border-gaming-border">
              <h3 className="text-sm font-medium text-white mb-3">
                Architecture Overview
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Frontend</span>
                  <span className="text-white">Next.js 15 + TypeScript</span>
                </div>
                <div className="flex justify-between">
                  <span>Styling</span>
                  <span className="text-white">TailwindCSS + shadcn/ui</span>
                </div>
                <div className="flex justify-between">
                  <span>Database</span>
                  <span className="text-white">SQLite (better-sqlite3)</span>
                </div>
                <div className="flex justify-between">
                  <span>AI</span>
                  <span className="text-white">DeepSeek / OpenAI</span>
                </div>
                <div className="flex justify-between">
                  <span>Deployment</span>
                  <span className="text-white">GitHub + Vercel</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gaming-bg rounded-lg border border-gaming-border">
              <h3 className="text-sm font-medium text-white mb-3">
                Environment Variables
              </h3>
              <div className="space-y-2 text-xs font-mono text-muted-foreground">
                <p>
                  <span className="text-gaming-red">DEEPSEEK_API_KEY</span> - AI
                  generation (primary)
                </p>
                <p>
                  <span className="text-gaming-red">OPENAI_API_KEY</span> - AI
                  generation (alternative)
                </p>
                <p>
                  <span className="text-gaming-red">GITHUB_TOKEN</span> - Git
                  operations
                </p>
                <p>
                  <span className="text-gaming-red">VERCEL_TOKEN</span> - Deploy
                  hooks
                </p>
              </div>
            </div>

            <div className="p-4 bg-gaming-bg rounded-lg border border-gaming-border">
              <h3 className="text-sm font-medium text-white mb-2">
                Content Pipeline
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-gaming-red">YouTube</span>
                <span>→</span>
                <span>Transcript</span>
                <span>→</span>
                <span className="text-gaming-red">AI</span>
                <span>→</span>
                <span>Markdown</span>
                <span>→</span>
                <span className="text-gaming-red">GitHub</span>
                <span>→</span>
                <span>Vercel</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}