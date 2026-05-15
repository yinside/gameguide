import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(id);
  if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  return NextResponse.json(site);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  db.prepare(`
    UPDATE sites SET
      name = ?, domain = ?, repo_url = ?, game_category = ?,
      content_path = ?, seo_title_template = ?, seo_description_template = ?,
      github_token = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    body.name, body.domain, body.repo_url, body.game_category || 'general',
    body.content_path || '/content', body.seo_title_template || '{title} | {siteName}',
    body.seo_description_template || '{description}', body.github_token || '',
    id
  );

  return NextResponse.json(db.prepare('SELECT * FROM sites WHERE id = ?').get(id));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM sites WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}