"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Send, Loader2, ExternalLink } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  site_id: string;
  category: string;
  created_at: string;
}

interface Site {
  id: string;
  name: string;
  domain: string;
  repo_url: string;
}

export default function PublishPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState("all");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("status", "ai_generated");
    if (selectedSite !== "all") params.set("siteId", selectedSite);
    const res = await fetch(`/api/articles?${params}`);
    setArticles(await res.json());
    setLoading(false);
  }, [selectedSite]);

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then(setSites);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadArticles();
  }, [loadArticles]);

  const handlePublish = async (article: Article) => {
    setPublishing(article.id);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          siteId: article.site_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Published to GitHub successfully!");
      } else {
        toast.error(data.message || "Failed to publish");
      }
    } catch {
      toast.error("Failed to publish");
    } finally {
      setPublishing(null);
      loadArticles();
    }
  };

  const getSite = (siteId: string) => sites.find((s) => s.id === siteId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Publish</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Push articles to GitHub and trigger deployments
          </p>
        </div>
        <Select value={selectedSite} onValueChange={(v) => setSelectedSite(v || "all")}>
          <SelectTrigger className="w-40 bg-gaming-bg border-gaming-border text-white h-9 text-sm">
            <SelectValue placeholder="Filter by site" />
          </SelectTrigger>
          <SelectContent className="bg-gaming-card border-gaming-border">
            <SelectItem value="all">All Sites</SelectItem>
            {sites.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {articles.length === 0 ? (
        <Card className="bg-gaming-card border-gaming-border">
          <CardContent className="py-12 text-center">
            <Send className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No articles ready to publish. Generate articles first.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => {
            const site = getSite(article.site_id);
            const isPublishing = publishing === article.id;

            return (
              <Card
                key={article.id}
                className="bg-gaming-card border-gaming-border"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-gaming-red/15 text-gaming-red border-gaming-red/30">
                          Ready
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-white font-medium truncate">
                        {article.title}
                      </h3>
                      {site && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: {site.name} ({site.domain}) ·{" "}
                          {site.repo_url}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      {site && (
                        <a
                          href={`https://${site.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Button
                        onClick={() => handlePublish(article)}
                        disabled={isPublishing}
                        className="bg-gaming-red hover:bg-gaming-red-hover text-white gap-2"
                      >
                        {isPublishing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {isPublishing ? "Publishing..." : "Publish"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}