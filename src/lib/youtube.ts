import { Innertube } from 'youtubei.js';
import { YoutubeTranscript } from 'youtube-transcript';

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

  let title = '';
  try {
    const yt = await getYT();
    const info = await yt.getBasicInfo(videoId);
    title = info.basic_info?.title || '';
  } catch {
    // title fallback
  }

  let transcriptText = '';
  let transcriptError = '';

  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    transcriptText = segments
      .map((s) => s.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (e) {
    transcriptError = e instanceof Error ? e.message : 'Unknown error';
  }

  if (!transcriptText) {
    throw new Error(
      transcriptError.includes('disabled')
        ? 'This video does not have captions/subtitles available. Try a different video that has CC (closed captions) enabled.'
        : `Could not extract transcript: ${transcriptError || 'No captions available'}`
    );
  }

  return {
    videoId,
    url,
    title: title || `YouTube Video ${videoId}`,
    transcript: transcriptText,
    thumbnailUrl: getThumbnailUrl(videoId),
  };
}