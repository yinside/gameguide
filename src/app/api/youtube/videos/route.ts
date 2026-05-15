import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const videos = db.prepare('SELECT * FROM youtube_videos ORDER BY imported_at DESC').all();
  return NextResponse.json(videos);
}