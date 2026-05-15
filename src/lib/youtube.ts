import { YoutubeTranscript } from 'youtube-transcript';

export interface VideoInfo {
  videoId: string;
  url: string;
  title: string;
  transcript: string;
  thumbnailUrl: string;
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

  const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
  const transcript = transcriptItems
    .map((item) => item.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const title = `YouTube Video ${videoId}`;

  return {
    videoId,
    url,
    title,
    transcript,
    thumbnailUrl: getThumbnailUrl(videoId),
  };
}