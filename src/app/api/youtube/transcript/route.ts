import { NextRequest, NextResponse } from 'next/server';
import { fetchTranscript, extractVideoId } from '@/lib/youtube';
import { getDb } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Could not extract video ID from URL' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT * FROM youtube_videos WHERE video_id = ?').get(videoId) as Record<string, unknown> | undefined;

    if (existing) {
      return NextResponse.json({
        ...existing,
        transcript: existing.transcript || '',
      });
    }

    const videoInfo = await fetchTranscript(url);

    const id = uuid();
    db.prepare(`
      INSERT INTO youtube_videos (id, url, video_id, title, transcript, thumbnail_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, url, videoInfo.videoId, videoInfo.title, videoInfo.transcript, videoInfo.thumbnailUrl);

    return NextResponse.json({
      id,
      url: videoInfo.url,
      videoId: videoInfo.videoId,
      title: videoInfo.title,
      transcript: videoInfo.transcript,
      thumbnailUrl: videoInfo.thumbnailUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}