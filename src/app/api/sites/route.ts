import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function GET() {
  const db = getDb();
  const sites = db.prepare('SELECT * FROM sites ORDER BY created_at DESC').all();
  return NextResponse.json(sites);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();

  const id = uuid();
  db.prepare(`
    INSERT INTO sites (id, name, domain, repo_url, game_category, content_path, seo_title_template, seo_description_template, github_token)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    body.name,
    body.domain,
    body.repo_url,
    body.game_category || 'general',
    body.content_path || '/content',
    body.seo_title_template || '{title} | {siteName}',
    body.seo_description_template || '{description}',
    body.github_token || ''
  );

  return NextResponse.json(db.prepare('SELECT * FROM sites WHERE id = ?').get(id), { status: 201 });
}