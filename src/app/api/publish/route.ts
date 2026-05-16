import { NextRequest, NextResponse } from 'next/server';
import { publishToGitHub, triggerVercelDeploy } from '@/lib/github';
import { dbGet, dbAll } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { articleId, siteId } = await req.json();

    if (!articleId || !siteId) {
      return NextResponse.json(
        { error: 'articleId and siteId are required' },
        { status: 400 }
      );
    }

    const article = await dbGet('SELECT * FROM articles WHERE id = ?', [articleId]) as Record<string, unknown> | undefined;
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const site = await dbGet('SELECT * FROM sites WHERE id = ?', [siteId]) as Record<string, unknown> | undefined;
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const token = (site.github_token as string) || process.env.GITHUB_TOKEN || '';
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured. Add it in site settings or GITHUB_TOKEN env var.' },
        { status: 400 }
      );
    }

    const contentPath = (site.content_path as string) || '/content';
    const fileName = `${article.slug}.md`;
    const filePath = `${contentPath.replace(/^\/|\/$/g, '')}/${fileName}`;

    const result = await publishToGitHub({
      repoUrl: site.repo_url as string,
      token,
      filePath,
      content: article.content as string,
      commitMessage: `feat: add ${article.title}`,
    });

    if (result.success) {
      const logId = uuid();
      await dbAll(
        `INSERT INTO publish_logs (id, article_id, site_id, status, commit_sha, message)
         VALUES (?, ?, ?, 'success', ?, ?)`,
        [logId, articleId, siteId, result.commitSha || '', 'Published successfully']
      );

      await dbAll("UPDATE articles SET status = 'published', updated_at = datetime('now') WHERE id = ?", [articleId]);

      await triggerVercelDeploy();

      return NextResponse.json({
        success: true,
        commitSha: result.commitSha,
        message: result.message,
      });
    }

    const logId = uuid();
    await dbAll(
      `INSERT INTO publish_logs (id, article_id, site_id, status, message)
       VALUES (?, ?, ?, 'failed', ?)`,
      [logId, articleId, siteId, result.message]
    );

    return NextResponse.json({ success: false, message: result.message }, { status: 500 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to publish' },
      { status: 500 }
    );
  }
}