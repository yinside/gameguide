import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbAll } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await dbGet(
    'SELECT a.*, s.name as site_name FROM articles a LEFT JOIN sites s ON a.site_id = s.id WHERE a.id = ?',
    [id]
  );
  if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  await dbAll(
    `UPDATE articles SET
      title = ?, slug = ?, description = ?, tags = ?, category = ?,
      content = ?, frontmatter = ?, seo_title = ?, seo_description = ?,
      status = ?, updated_at = datetime('now')
    WHERE id = ?`,
    [body.title, body.slug, body.description || '', JSON.stringify(body.tags || []),
     body.category || 'general', body.content || '', JSON.stringify(body.frontmatter || {}),
     body.seo_title || '', body.seo_description || '', body.status || 'draft', id]
  );

  const article = await dbGet(
    'SELECT a.*, s.name as site_name FROM articles a LEFT JOIN sites s ON a.site_id = s.id WHERE a.id = ?',
    [id]
  );
  return NextResponse.json(article);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbAll('DELETE FROM articles WHERE id = ?', [id]);
  return NextResponse.json({ success: true });
}