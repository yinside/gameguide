import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbAll } from '@/lib/db';
import { generateArticle } from '@/lib/openai';
import { generateFrontmatter, assembleMarkdownFile, generateSlug } from '@/lib/markdown';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let transcript: string;
    let videoTitle: string;
    let gameCategory: string;
    let siteName: string;
    let siteId: string;
    let category: string;
    let articleId: string | undefined;

    if (body.articleId) {
      // Mode B: from articles page — look up existing article
      articleId = body.articleId;
      const article = await dbGet(
        'SELECT a.*, s.name as site_name, s.game_category FROM articles a LEFT JOIN sites s ON a.site_id = s.id WHERE a.id = ?',
        [articleId]
      ) as Record<string, unknown> | undefined;

      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }

      transcript = String(article.transcript || '');
      videoTitle = String(article.title || 'Game Guide');
      gameCategory = String(article.game_category || 'general');
      siteName = String(article.site_name || 'STS2BestBuilds');
      siteId = String(article.site_id || '');
      category = String(article.category || 'general');
    } else {
      // Mode A: from YouTube page — direct transcript input
      transcript = body.transcript;
      videoTitle = body.videoTitle || 'Game Guide';
      gameCategory = body.gameCategory || 'general';
      siteName = body.siteName || 'STS2BestBuilds';
      siteId = body.siteId;
      category = body.category || 'build-guide';

      if (!transcript) {
        return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
      }
      if (!siteId) {
        return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
      }

      // Create a temp article record for this generation
      articleId = uuid();
      const titleSlug = videoTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      await dbAll(
        `INSERT INTO articles (id, site_id, title, slug, description, tags, category, content, frontmatter, youtube_url, video_id, thumbnail_url, seo_title, seo_description, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          articleId, siteId, videoTitle, titleSlug, '', '[]', category, '', '{}',
          body.youtubeUrl || '', body.videoId || '', body.thumbnailUrl || '',
          '', '', 'draft',
        ]
      );
    }

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript found. Import a YouTube video first.' }, { status: 400 });
    }

    const result = await generateArticle({
      transcript,
      videoTitle,
      gameCategory,
      siteName,
    });

    const displayTitle = result.seoTitle
      .replace(/\s*\|\s*STS2BestBuilds\s*$/i, '')
      .trim() || videoTitle;

    const slug = result.slug || generateSlug(displayTitle);

    const frontmatter = generateFrontmatter({
      title: displayTitle,
      description: result.seoDescription,
      slug,
      category,
      tags: result.tags || [],
      date: new Date().toISOString().split('T')[0],
    });

    const fullContent = assembleMarkdownFile(frontmatter, result.markdown);

    await dbAll(
      `UPDATE articles SET
        title = ?, slug = ?, description = ?, tags = ?, content = ?,
        seo_title = ?, seo_description = ?, status = 'ai_generated', updated_at = datetime('now')
      WHERE id = ?`,
      [displayTitle, slug, result.seoDescription, JSON.stringify(result.tags || []),
       fullContent, result.seoTitle, result.seoDescription, articleId]
    );

    const updated = await dbGet(
      'SELECT a.*, s.name as site_name FROM articles a LEFT JOIN sites s ON a.site_id = s.id WHERE a.id = ?',
      [articleId]
    );

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}