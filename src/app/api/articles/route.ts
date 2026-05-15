import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  const url = new URL(req.url);
  const siteId = url.searchParams.get('siteId');
  const status = url.searchParams.get('status');

  let query = 'SELECT * FROM articles';
  const conditions: string[] = [];
  const params: string[] = [];

  if (siteId) {
    conditions.push('site_id = ?');
    params.push(siteId);
  }
  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  const articles = db.prepare(query).all(...params);
  return NextResponse.json(articles);
}