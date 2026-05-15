"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Globe, Pencil, Trash2 } from "lucide-react";

interface Site {
  id: string;
  name: string;
  domain: string;
  repo_url: string;
  game_category: string;
  content_path: string;
  seo_title_template: string;
  github_token: string;
  created_at: string;
}

const defaultSite = {
  name: "",
  domain: "",
  repo_url: "",
  game_category: "general",
  content_path: "/content",
  seo_title_template: "{title} | {siteName}",
  seo_description_template: "{description}",
  github_token: "",
};

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [form, setForm] = useState(defaultSite);

  const loadSites = async () => {
    const res = await fetch("/api/sites");
    setSites(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    loadSites();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.domain || !form.repo_url) {
      toast.error("Name, domain, and repo URL are required");
      return;
    }

    const url = editingSite
      ? `/api/sites/${editingSite.id}`
      : "/api/sites";
    const method = editingSite ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success(editingSite ? "Site updated" : "Site created");
      setDialogOpen(false);
      setEditingSite(null);
      setForm(defaultSite);
      loadSites();
    } else {
      toast.error("Failed to save site");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;
    await fetch(`/api/sites/${id}`, { method: "DELETE" });
    toast.success("Site deleted");
    loadSites();
  };

  const openEdit = (site: Site) => {
    setEditingSite(site);
    setForm({
      name: site.name,
      domain: site.domain,
      repo_url: site.repo_url,
      game_category: site.game_category,
      content_path: site.content_path,
      seo_title_template: site.seo_title_template,
      seo_description_template: "",
      github_token: site.github_token || "",
    });
    setDialogOpen(true);
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
          <h1 className="text-2xl font-bold text-white">Sites</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your gaming websites
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button
                className="bg-gaming-red hover:bg-gaming-red-hover text-white gap-2"
                onClick={() => {
                  setEditingSite(null);
                  setForm(defaultSite);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Site
              </Button>
            }
          />
          <DialogContent className="bg-gaming-card border-gaming-border text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingSite ? "Edit Site" : "Add New Site"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  placeholder="STS2 Builds"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-gaming-bg border-gaming-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Domain</Label>
                <Input
                  placeholder="buildmeta.gg"
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="bg-gaming-bg border-gaming-border"
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub Repo URL</Label>
                <Input
                  placeholder="https://github.com/user/repo"
                  value={form.repo_url}
                  onChange={(e) =>
                    setForm({ ...form, repo_url: e.target.value })
                  }
                  className="bg-gaming-bg border-gaming-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Game Category</Label>
                  <Select
                    value={form.game_category}
                    onValueChange={(v) =>
                      setForm({ ...form, game_category: v || "general" })
                    }
                  >
                    <SelectTrigger className="bg-gaming-bg border-gaming-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gaming-card border-gaming-border">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="rpg">RPG</SelectItem>
                      <SelectItem value="strategy">Strategy</SelectItem>
                      <SelectItem value="card-game">Card Game</SelectItem>
                      <SelectItem value="moba">MOBA</SelectItem>
                      <SelectItem value="fps">FPS</SelectItem>
                      <SelectItem value="roguelike">Roguelike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Content Path</Label>
                  <Input
                    placeholder="/content"
                    value={form.content_path}
                    onChange={(e) =>
                      setForm({ ...form, content_path: e.target.value })
                    }
                    className="bg-gaming-bg border-gaming-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>SEO Title Template</Label>
                <Input
                  placeholder="{title} | {siteName}"
                  value={form.seo_title_template}
                  onChange={(e) =>
                    setForm({ ...form, seo_title_template: e.target.value })
                  }
                  className="bg-gaming-bg border-gaming-border"
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub Token (optional)</Label>
                <Input
                  type="password"
                  placeholder="ghp_..."
                  value={form.github_token}
                  onChange={(e) =>
                    setForm({ ...form, github_token: e.target.value })
                  }
                  className="bg-gaming-bg border-gaming-border"
                />
              </div>
              <Button
                onClick={handleSave}
                className="w-full bg-gaming-red hover:bg-gaming-red-hover text-white"
              >
                {editingSite ? "Update Site" : "Create Site"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sites.length === 0 ? (
        <Card className="bg-gaming-card border-gaming-border">
          <CardContent className="py-12 text-center">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No sites yet. Add your first gaming website.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sites.map((site) => (
            <Card
              key={site.id}
              className="bg-gaming-card border-gaming-border hover:border-gaming-red/30 transition-colors"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {site.name}
                    </h3>
                    <p className="text-sm text-gaming-red mt-0.5">
                      {site.domain}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Badge
                        variant="outline"
                        className="border-gaming-border text-muted-foreground"
                      >
                        {site.game_category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-gaming-border text-muted-foreground font-mono text-xs"
                      >
                        {site.content_path}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                      {site.repo_url}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-white"
                      onClick={() => openEdit(site)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-400"
                      onClick={() => handleDelete(site.id)}
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
    </div>
  );
}