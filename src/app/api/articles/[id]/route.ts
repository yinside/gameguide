import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  if (body.status) {
    db.prepare('UPDATE articles SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').run(body.status, id);
  }

  if (body.content !== undefined) {
    db.prepare('UPDATE articles SET content = ?, updated_at = datetime(\'now\') WHERE id = ?').run(body.content, id);
  }

  if (body.title) {
    db.prepare('UPDATE articles SET title = ?, updated_at = datetime(\'now\') WHERE id = ?').run(body.title, id);
  }

  return NextResponse.json(db.prepare('SELECT * FROM articles WHERE id = ?').get(id));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM articles WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}