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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Eye, Trash2, CheckCircle2 } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string;
  category: string;
  content: string;
  status: string;
  site_id: string;
  thumbnail_url: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
}

interface Site {
  id: string;
  name: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSite, setFilterSite] = useState("all");
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then(setSites);
  }, []);

  const loadArticles = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (filterSite !== "all") params.set("siteId", filterSite);
    const res = await fetch(`/api/articles?${params}`);
    setArticles(await res.json());
  }, [filterStatus, filterSite]);

  useEffect(() => {
    setLoading(true);
    loadArticles().finally(() => setLoading(false));
  }, [loadArticles]);

  const getSiteName = (siteId: string) =>
    sites.find((s) => s.id === siteId)?.name || "Unknown";

  const statusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      draft: {
        label: "Draft",
        className: "bg-gray-500/15 text-gray-400 border-gray-500/30",
      },
      ai_generated: {
        label: "AI Generated",
        className: "bg-gaming-red/15 text-gaming-red border-gaming-red/30",
      },
      reviewed: {
        label: "Reviewed",
        className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      },
      published: {
        label: "Published",
        className: "bg-green-500/15 text-green-400 border-green-500/30",
      },
    };
    const c = config[status] || {
      label: status,
      className: "",
    };
    return (
      <Badge variant="outline" className={c.className}>
        {c.label}
      </Badge>
    );
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    toast.success(`Status updated to ${status}`);
    loadArticles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    toast.success("Article deleted");
    loadArticles();
  };

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
          <h1 className="text-2xl font-bold text-white">Articles</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Content queue & publishing management
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v || "all")}>
            <SelectTrigger className="w-36 bg-gaming-bg border-gaming-border text-white h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gaming-card border-gaming-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="ai_generated">AI Generated</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSite} onValueChange={(v) => setFilterSite(v || "all")}>
            <SelectTrigger className="w-36 bg-gaming-bg border-gaming-border text-white h-9 text-sm">
              <SelectValue placeholder="Site" />
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
      </div>

      {articles.length === 0 ? (
        <Card className="bg-gaming-card border-gaming-border">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No articles found. Import a YouTube video to generate one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="bg-gaming-card border-gaming-border hover:border-gaming-red/20 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {statusBadge(article.status)}
                      <span className="text-xs text-muted-foreground">
                        {getSiteName(article.site_id)} · {article.category}
                      </span>
                    </div>
                    <h3 className="text-white font-medium truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {article.seo_description || article.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-white h-8"
                      onClick={() => setPreviewArticle(article)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    {article.status !== "published" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-green-400 h-8"
                        onClick={() => updateStatus(article.id, "published")}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-red-400 h-8"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!previewArticle} onOpenChange={() => setPreviewArticle(null)}>
        <DialogContent className="bg-gaming-card border-gaming-border text-white max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewArticle?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {previewArticle?.thumbnail_url && (
              <img
                src={previewArticle.thumbnail_url}
                alt=""
                className="w-full rounded-lg mb-4 max-h-48 object-cover"
              />
            )}
            <pre className="bg-gaming-bg p-4 rounded-lg border border-gaming-border text-sm text-muted-foreground whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
              {previewArticle?.content}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}