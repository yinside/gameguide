import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbAll } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const site = await dbGet('SELECT * FROM sites WHERE id = ?', [id]);
  if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  return NextResponse.json(site);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  await dbAll(
    `UPDATE sites SET
      name = ?, domain = ?, repo_url = ?, game_category = ?,
      content_path = ?, seo_title_template = ?, seo_description_template = ?,
      github_token = ?, updated_at = datetime('now')
    WHERE id = ?`,
    [body.name, body.domain, body.repo_url, body.game_category || 'general',
     body.content_path || '/content', body.seo_title_template || '{title} | {siteName}',
     body.seo_description_template || '{description}', body.github_token || '', id]
  );

  const site = await dbGet('SELECT * FROM sites WHERE id = ?', [id]);
  return NextResponse.json(site);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbAll('DELETE FROM sites WHERE id = ?', [id]);
  return NextResponse.json({ success: true });
}