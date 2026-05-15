export function generateFrontmatter(article: {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  category: string;
  thumbnailUrl?: string;
  date?: string;
}): string {
  const lines = [
    '---',
    `title: "${article.title.replace(/"/g, '\\"')}"`,
    `description: "${article.description.replace(/"/g, '\\"')}"`,
    `slug: "${article.slug}"`,
    `category: "${article.category}"`,
    `date: "${article.date || new Date().toISOString().split('T')[0]}"`,
  ];

  if (article.tags.length > 0) {
    lines.push(`tags: [${article.tags.map((t) => `"${t}"`).join(', ')}]`);
  }

  if (article.thumbnailUrl) {
    lines.push(`image: "${article.thumbnailUrl}"`);
  }

  lines.push('---');
  lines.push('');
  lines.push('');

  return lines.join('\n');
}

export function assembleMarkdownFile(
  frontmatter: string,
  body: string
): string {
  return frontmatter + body;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}