"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Video, Loader2, Sparkles, FileText, Eye } from "lucide-react";

interface Site {
  id: string;
  name: string;
  domain: string;
  game_category: string;
}

interface VideoInfo {
  id: string;
  videoId: string;
  title: string;
  transcript: string;
  thumbnailUrl: string;
  url: string;
}

export default function YouTubePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [category, setCategory] = useState("build-guide");
  const [generating, setGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then(setSites);
  }, []);

  const handleFetchTranscript = async () => {
    if (!url.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }
    setLoading(true);
    setVideo(null);
    try {
      const res = await fetch("/api/youtube/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideo(data);
      toast.success("Transcript extracted successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to fetch transcript");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!video || !selectedSite) {
      toast.error("Please select a site and fetch a transcript first");
      return;
    }

    const site = sites.find((s) => s.id === selectedSite);
    if (!site) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: video.transcript,
          videoTitle: video.title,
          gameCategory: site.game_category,
          siteName: site.name,
          siteId: selectedSite,
          category,
          youtubeUrl: video.url,
          videoId: video.videoId,
          thumbnailUrl: video.thumbnailUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeneratedArticle(data);
      toast.success("Article generated successfully!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate article");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">YouTube Import</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Paste a YouTube URL, extract the transcript, and generate an AI article
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gaming-card border-gaming-border">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-gaming-red" />
                Step 1: Paste YouTube URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-gaming-bg border-gaming-border text-white"
                  onKeyDown={(e) => e.key === "Enter" && handleFetchTranscript()}
                />
                <Button
                  onClick={handleFetchTranscript}
                  disabled={loading}
                  className="bg-gaming-red hover:bg-gaming-red-hover text-white shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Extract"
                  )}
                </Button>
              </div>

              {video && (
                <div className="space-y-3">
                  {video.thumbnailUrl && (
                    <img
                      src={video.thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full max-w-md rounded-lg"
                    />
                  )}
                  <div>
                    <Label className="text-muted-foreground text-xs">
                      Transcript Preview
                    </Label>
                    <div className="mt-1 p-3 bg-gaming-bg rounded-lg border border-gaming-border text-sm text-muted-foreground max-h-40 overflow-y-auto">
                      {video.transcript.slice(0, 500)}
                      {video.transcript.length > 500 && "..."}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {video.transcript.length.toLocaleString()} characters extracted
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {video && (
            <Card className="bg-gaming-card border-gaming-border">
              <CardHeader>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gaming-red" />
                  Step 2: Generate Article
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Target Website
                    </Label>
                    <Select
                      value={selectedSite}
                      onValueChange={(v) => setSelectedSite(v || "")}
                    >
                      <SelectTrigger className="bg-gaming-bg border-gaming-border text-white">
                        <SelectValue placeholder="Select a site" />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-card border-gaming-border">
                        {sites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.name} ({site.domain})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Category
                    </Label>
                    <Select value={category} onValueChange={(v) => setCategory(v || "build-guide")}>
                      <SelectTrigger className="bg-gaming-bg border-gaming-border text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-card border-gaming-border">
                        <SelectItem value="build-guide">Build Guide</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                        <SelectItem value="tier-list">Tier List</SelectItem>
                        <SelectItem value="beginner-guide">
                          Beginner Guide
                        </SelectItem>
                        <SelectItem value="meta-analysis">
                          Meta Analysis
                        </SelectItem>
                        <SelectItem value="boss-guide">Boss Guide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={generating || !selectedSite}
                  className="w-full bg-gaming-red hover:bg-gaming-red-hover text-white gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate AI Article
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {generatedArticle && (
            <Card className="bg-gaming-card border-gaming-border border-gaming-red/30">
              <CardHeader>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  Generated Article
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <p className="text-sm text-white mt-0.5">
                    {generatedArticle.seo_title as string}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Slug</Label>
                  <p className="text-sm text-muted-foreground font-mono mt-0.5">
                    {generatedArticle.slug as string}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge className="mt-1 bg-gaming-red/15 text-gaming-red border-gaming-red/30">
                    {generatedArticle.status as string}
                  </Badge>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gaming-border text-muted-foreground hover:text-white gap-1"
                    onClick={() => {
                      const content = generatedArticle.content as string;
                      const win = window.open("", "_blank");
                      if (win) {
                        win.document.write(
                          `<pre style="color:white;background:#111;padding:20px;font-family:monospace;white-space:pre-wrap;word-wrap:break-word">${content}</pre>`
                        );
                      }
                    }}
                  >
                    <Eye className="w-3 h-3" />
                    Preview Markdown
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gaming-card border-gaming-border">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-gaming-red font-bold">1.</span>
                  Paste any YouTube gaming video URL
                </li>
                <li className="flex gap-2">
                  <span className="text-gaming-red font-bold">2.</span>
                  Extract & preview the transcript
                </li>
                <li className="flex gap-2">
                  <span className="text-gaming-red font-bold">3.</span>
                  Select target website & category
                </li>
                <li className="flex gap-2">
                  <span className="text-gaming-red font-bold">4.</span>
                  AI generates SEO-optimized markdown
                </li>
                <li className="flex gap-2">
                  <span className="text-gaming-red font-bold">5.</span>
                  Review & publish to your site
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}