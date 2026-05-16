import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbAll } from '@/lib/db';
import { generateArticle } from '@/lib/openai';
import { generateFrontmatter, assembleMarkdownFile, generateSlug } from '@/lib/markdown';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { articleId } = body;

  if (!articleId) {
    return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
  }

  const article = await dbGet(
    'SELECT a.*, s.name as site_name, s.game_category FROM articles a LEFT JOIN sites s ON a.site_id = s.id WHERE a.id = ?',
    [articleId]
  );

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const transcript = String(article.transcript || '');
  if (!transcript) {
    return NextResponse.json({ error: 'No transcript found. Import a YouTube video first.' }, { status: 400 });
  }

  try {
    const result = await generateArticle({
      transcript,
      videoTitle: String(article.title || 'Game Guide'),
      gameCategory: String(article.game_category || 'general'),
      siteName: String(article.site_name || 'STS2BestBuilds'),
    });

    const displayTitle = result.seoTitle.replace(/\s*\|\s*STS2BestBuilds\s*$/i, '').trim() || String(article.title || 'Guide');
    const slug = result.slug || generateSlug(displayTitle);

    const frontmatter = generateFrontmatter({
      title: displayTitle,
      description: result.seoDescription,
      slug,
      category: String(article.category || 'general'),
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