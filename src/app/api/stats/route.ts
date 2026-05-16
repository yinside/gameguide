import { NextResponse } from 'next/server';
import { dbAll } from '@/lib/db';

function countBy(arr: Record<string, unknown>[], key: string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of arr) {
    const val = String(item[key] ?? 'unknown');
    result[val] = (result[val] || 0) + 1;
  }
  return result;
}

export async function GET() {
  const articles = await dbAll('SELECT * FROM articles');
  const sites = await dbAll('SELECT * FROM sites');

  const totalArticles = articles.length;
  const totalSites = sites.length;
  const published = articles.filter((a: Record<string, unknown>) => a.status === 'published').length;
  const statusBreakdown = countBy(articles, 'status');
  const byCategory = countBy(articles, 'category');
  const articlesBySite = countBy(articles, 'site_id');

  let recentArticles: Record<string, unknown>[] = [];
  if (totalArticles > 0) {
    recentArticles = await dbAll(
      'SELECT a.*, s.name as site_name FROM articles a LEFT JOIN sites s ON a.site_id = s.id ORDER BY a.updated_at DESC LIMIT 10'
    );
  }

  let recentPublishes: Record<string, unknown>[] = [];
  const logs = await dbAll('SELECT * FROM publish_logs');
  if (logs.length > 0) {
    recentPublishes = await dbAll(
      'SELECT p.*, a.title as article_title, s.name as site_name FROM publish_logs p LEFT JOIN articles a ON p.article_id = a.id LEFT JOIN sites s ON p.site_id = s.id ORDER BY p.created_at DESC LIMIT 10'
    );
  }

  return NextResponse.json({
    totalArticles,
    totalSites,
    published,
    statusBreakdown,
    byCategory,
    articlesBySite,
    recentArticles,
    recentPublishes,
  });
}