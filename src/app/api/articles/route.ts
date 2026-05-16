import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbAll } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get('siteId');
  const status = searchParams.get('status');

  let sql = 'SELECT a.*, s.name as site_name FROM articles a LEFT JOIN sites s ON a.site_id = s.id WHERE 1=1';
  const params: unknown[] = [];

  if (siteId) {
    sql += ' AND a.site_id = ?';
    params.push(siteId);
  }
  if (status) {
    sql += ' AND a.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY a.updated_at DESC';
  const articles = await dbAll(sql, params);
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { v4: uuid } = await import('uuid');

  const id = uuid();
  await dbAll(
    `INSERT INTO articles (id, site_id, title, slug, description, tags, category, content, frontmatter, youtube_url, video_id, thumbnail_url, seo_title, seo_description, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, body.site_id, body.title, body.slug, body.description || '', JSON.stringify(body.tags || []),
     body.category || 'general', body.content || '', JSON.stringify(body.frontmatter || {}),
     body.youtube_url || '', body.video_id || '', body.thumbnail_url || '',
     body.seo_title || '', body.seo_description || '', body.status || 'draft']
  );

  const article = await dbGet(
    'SELECT a.*, s.name as site_name FROM articles a LEFT JOIN sites s ON a.site_id = s.id WHERE a.id = ?',
    [id]
  );
  return NextResponse.json(article, { status: 201 });
}