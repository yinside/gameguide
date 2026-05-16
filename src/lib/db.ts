import { createClient } from '@libsql/client';

type TursoClient = ReturnType<typeof createClient>;

let client: TursoClient;
let initPromise: Promise<void> | null = null;

function getClient(): TursoClient {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) {
      throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required');
    }
    client = createClient({ url, authToken });
  }
  return client;
}

async function initDb(): Promise<void> {
  const c = getClient();
  await c.batch([
    `CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT NOT NULL,
      repo_url TEXT NOT NULL,
      game_category TEXT NOT NULL DEFAULT 'general',
      content_path TEXT NOT NULL DEFAULT '/content',
      seo_title_template TEXT DEFAULT '{title} | {siteName}',
      seo_description_template TEXT DEFAULT '{description}',
      github_token TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT DEFAULT '',
      tags TEXT DEFAULT '[]',
      category TEXT DEFAULT 'general',
      content TEXT DEFAULT '',
      frontmatter TEXT DEFAULT '{}',
      youtube_url TEXT DEFAULT '',
      video_id TEXT DEFAULT '',
      thumbnail_url TEXT DEFAULT '',
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS youtube_videos (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      video_id TEXT NOT NULL UNIQUE,
      title TEXT DEFAULT '',
      transcript TEXT DEFAULT '',
      thumbnail_url TEXT DEFAULT '',
      duration TEXT DEFAULT '',
      channel_name TEXT DEFAULT '',
      imported_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS publish_logs (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'pending',
      commit_sha TEXT DEFAULT '',
      message TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ], 'write');
}

async function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = initDb();
  }
  await initPromise;
}

export async function dbGet<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  await ensureInit();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await getClient().execute({ sql, args: params as any });
  return result.rows[0] as T | undefined;
}

export async function dbAll<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ensureInit();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await getClient().execute({ sql, args: params as any });
  return result.rows as unknown as T[];
}

export async function dbRun(sql: string, params: unknown[] = []): Promise<void> {
  await ensureInit();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await getClient().execute({ sql, args: params as any });
}