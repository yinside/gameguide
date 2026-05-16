import { Innertube } from 'youtubei.js';

export interface VideoInfo {
  videoId: string;
  url: string;
  title: string;
  transcript: string;
  thumbnailUrl: string;
}

let ytInstance: Innertube | null = null;

async function getYT(): Promise<Innertube> {
  if (!ytInstance) {
    ytInstance = await Innertube.create({ lang: 'en', location: 'US' });
  }
  return ytInstance;
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtube\.com\/shorts\/)([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export async function fetchTranscript(url: string): Promise<VideoInfo> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL. Could not extract video ID.');
  }

  const yt = await getYT();
  const info = await yt.getInfo(videoId);

  const title = info.primary_info?.title?.text || info.basic_info?.title || `YouTube Video ${videoId}`;

  let transcript = '';
  try {
    const transcriptInfo = await info.getTranscript();
    const body = transcriptInfo.transcript?.content?.body;
    if (!body || !body.initial_segments || body.initial_segments.length === 0) {
      throw new Error('No transcript available');
    }
    transcript = body.initial_segments
      .filter((s) => s.type === 'TranscriptSegment')
      .map((s) => s.snippet.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    throw new Error(
      `Could not extract transcript for this video. The video may not have captions/subtitles available. ` +
      `Try a video that has CC (closed captions) enabled, or one from a channel known to provide subtitles.`
    );
  }

  if (!transcript) {
    throw new Error(
      'Transcript is empty. This video may not have any spoken content or captions are unavailable.'
    );
  }

  return {
    videoId,
    url,
    title,
    transcript,
    thumbnailUrl: getThumbnailUrl(videoId),
  };
}