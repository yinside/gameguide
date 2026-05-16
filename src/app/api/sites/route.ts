import { NextRequest, NextResponse } from 'next/server';
import { dbAll } from '@/lib/db';

export async function GET(_req: NextRequest) {
  const sites = await dbAll('SELECT * FROM sites ORDER BY created_at DESC');
  return NextResponse.json(sites);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { v4: uuid } = await import('uuid');

  const id = uuid();
  await dbAll(
    `INSERT INTO sites (id, name, domain, repo_url, game_category, content_path, seo_title_template, seo_description_template, github_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, body.name, body.domain, body.repo_url, body.game_category || 'general',
     body.content_path || '/content', body.seo_title_template || '{title} | {siteName}',
     body.seo_description_template || '{description}', body.github_token || '']
  );

  const site = await dbAll('SELECT * FROM sites WHERE id = ?', [id]);
  return NextResponse.json(site[0] || null, { status: 201 });
}