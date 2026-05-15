import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();

  const totalSites = (db.prepare('SELECT COUNT(*) as count FROM sites').get() as { count: number }).count;
  const totalArticles = (db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number }).count;
  const publishedArticles = (
    db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'published'").get() as { count: number }
  ).count;
  const draftArticles = (
    db.prepare("SELECT COUNT(*) as count FROM articles WHERE status IN ('draft', 'ai_generated', 'reviewed')").get() as {
      count: number;
    }
  ).count;
  const totalVideos = (db.prepare('SELECT COUNT(*) as count FROM youtube_videos').get() as { count: number }).count;

  return NextResponse.json({
    totalSites,
    totalArticles,
    publishedArticles,
    draftArticles,
    totalVideos,
  });
}