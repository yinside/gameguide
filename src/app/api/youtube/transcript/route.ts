import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbAll } from '@/lib/db';
import { fetchTranscript } from '@/lib/youtube';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
  }

  try {
    const transcriptData = await fetchTranscript(url);

    const row = await dbGet('SELECT * FROM youtube_videos WHERE video_id = ?', [transcriptData.videoId]) as Record<string, unknown> | undefined;

    const normalized = {
      id: row?.id || '',
      url,
      videoId: transcriptData.videoId,
      title: transcriptData.title,
      transcript: transcriptData.transcript,
      thumbnailUrl: transcriptData.thumbnailUrl,
    };

    if (row) {
      return NextResponse.json(normalized);
    }

    const id = uuid();
    await dbAll(
      `INSERT INTO youtube_videos (id, url, video_id, title, transcript, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, url, transcriptData.videoId, transcriptData.title, transcriptData.transcript, transcriptData.thumbnailUrl]
    );

    return NextResponse.json({ ...normalized, id }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to extract transcript';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}