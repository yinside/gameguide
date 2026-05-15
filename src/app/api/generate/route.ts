import { NextRequest, NextResponse } from 'next/server';
import { generateArticle } from '@/lib/openai';
import { generateFrontmatter, assembleMarkdownFile, generateSlug } from '@/lib/markdown';
import { getDb } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { transcript, videoTitle, gameCategory, siteName, siteId, category, youtubeUrl, videoId, thumbnailUrl } =
      await req.json();

    if (!transcript || !siteId) {
      return NextResponse.json(
        { error: 'Transcript and siteId are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(siteId) as Record<string, unknown> | undefined;
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const generated = await generateArticle({
      transcript,
      videoTitle: videoTitle || 'Gaming Guide',
      gameCategory: gameCategory || (site.game_category as string) || 'general',
      siteName: siteName || (site.name as string),
    });

    const slug = generated.slug || generateSlug(generated.seoTitle || videoTitle || 'guide');

    const frontmatter = generateFrontmatter({
      title: generated.seoTitle || videoTitle || 'Gaming Guide',
      description: generated.seoDescription || '',
      slug,
      tags: generated.tags,
      category: category || 'general',
      thumbnailUrl,
    });

    const fullMarkdown = assembleMarkdownFile(frontmatter, generated.markdown);

    const articleId = uuid();
    db.prepare(`
      INSERT INTO articles (id, site_id, title, slug, description, tags, category, content, frontmatter, youtube_url, video_id, thumbnail_url, seo_title, seo_description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ai_generated')
    `).run(
      articleId,
      siteId,
      generated.seoTitle || videoTitle || 'Gaming Guide',
      slug,
      generated.seoDescription || '',
      JSON.stringify(generated.tags),
      category || 'general',
      fullMarkdown,
      frontmatter,
      youtubeUrl || '',
      videoId || '',
      thumbnailUrl || '',
      generated.seoTitle || '',
      generated.seoDescription || ''
    );

    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate article' },
      { status: 500 }
    );
  }
}