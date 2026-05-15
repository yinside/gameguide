"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Video,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalSites: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalVideos: number;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  site_id: string;
  category: string;
  created_at: string;
  thumbnail_url: string;
}

interface VideoItem {
  id: string;
  title: string;
  video_id: string;
  thumbnail_url: string;
  imported_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, articlesRes, videosRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/articles"),
          fetch("/api/youtube/videos"),
        ]);
        setStats(await statsRes.json());
        setArticles(await articlesRes.json());
        setVideos(await videosRes.json());
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      ai_generated: "default",
      reviewed: "outline",
      published: "default",
    };
    return (
      <Badge
        variant={variants[status] || "secondary"}
        className={
          status === "published"
            ? "bg-green-500/15 text-green-400 border-green-500/30"
            : status === "ai_generated"
              ? "bg-gaming-red/15 text-gaming-red border-gaming-red/30"
              : ""
        }
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-red" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your AI-powered game guide network
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/youtube">
            <Button className="bg-gaming-red hover:bg-gaming-red-hover text-white gap-2">
              <Video className="w-4 h-4" />
              Import YouTube
            </Button>
          </Link>
          <Link href="/sites">
            <Button variant="outline" className="gap-2 border-gaming-border">
              <Plus className="w-4 h-4" />
              Add Site
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sites
            </CardTitle>
            <Globe className="w-4 h-4 text-gaming-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalSites || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active gaming websites
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats?.publishedArticles || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Live articles</p>
          </CardContent>
        </Card>

        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Queue
            </CardTitle>
            <Clock className="w-4 h-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats?.draftArticles || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Drafts & in review
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Videos Imported
            </CardTitle>
            <Video className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats?.totalVideos || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              YouTube transcripts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gaming-red" />
              Recent Articles
            </CardTitle>
            <Link href="/articles">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-white gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {articles.length === 0 ? (
              <p className="text-muted-foreground text-sm py-6 text-center">
                No articles yet. Import a YouTube video to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {articles.slice(0, 5).map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between py-2 border-b border-gaming-border last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {article.category} ·{" "}
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {statusBadge(article.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gaming-card border-gaming-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-blue-400" />
              Recent Imports
            </CardTitle>
            <Link href="/youtube">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-white gap-1"
              >
                Import More <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {videos.length === 0 ? (
              <p className="text-muted-foreground text-sm py-6 text-center">
                No videos imported yet. Paste a YouTube URL to start.
              </p>
            ) : (
              <div className="space-y-3">
                {videos.slice(0, 5).map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-3 py-2 border-b border-gaming-border last:border-0"
                  >
                    {video.thumbnail_url && (
                      <img
                        src={video.thumbnail_url}
                        alt=""
                        className="w-16 h-9 rounded object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(video.imported_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}