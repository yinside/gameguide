import { NextResponse } from 'next/server';
import { dbAll } from '@/lib/db';

export async function GET() {
  const videos = await dbAll('SELECT * FROM youtube_videos ORDER BY imported_at DESC');
  return NextResponse.json(videos);
}