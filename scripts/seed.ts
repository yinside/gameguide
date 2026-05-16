import { dbAll } from '../src/lib/db';
import { v4 as uuid } from 'uuid';

async function seed() {
  const now = new Date();
  const hoursAgo = (h: number) =>
    new Date(now.getTime() - h * 3600000).toISOString().replace('T', ' ').slice(0, 19);

  const sites = [
    {
      id: uuid(),
      name: 'STS2 Builds',
      domain: 'sts2builds.gg',
      repo_url: 'https://github.com/gamer/sts2-builds',
      game_category: 'roguelike',
      content_path: '/content/builds',
      seo_title_template: '{title} | STS2 Builds',
      seo_description_template: '{description}',
      github_token: '',
      created_at: hoursAgo(168),
      updated_at: hoursAgo(72),
    },
    {
      id: uuid(),
      name: 'LoL Meta Hub',
      domain: 'lolmeta.gg',
      repo_url: 'https://github.com/gamer/lol-meta-hub',
      game_category: 'moba',
      content_path: '/content/guides',
      seo_title_template: '{title} - LoL Meta Hub',
      seo_description_template: '{description}',
      github_token: '',
      created_at: hoursAgo(336),
      updated_at: hoursAgo(48),
    },
    {
      id: uuid(),
      name: 'Elden Ring Guides',
      domain: 'eldenbuilds.com',
      repo_url: 'https://github.com/gamer/elden-builds',
      game_category: 'rpg',
      content_path: '/content',
      seo_title_template: '{title} | Elden Ring Guides',
      seo_description_template: '{description}',
      github_token: '',
      created_at: hoursAgo(720),
      updated_at: hoursAgo(120),
    },
  ];

  const videos = [
    {
      id: uuid(),
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      video_id: 'dQw4w9WgXcQ',
      title: 'The Ultimate Poison Build Guide - Silent Archer',
      transcript: 'In this video I will show you how to build the ultimate poison character...',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      imported_at: hoursAgo(2),
    },
    {
      id: uuid(),
      url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      video_id: 'jNQXAC9IVRw',
      title: 'Top 10 BEST Relics for Act 3 Boss Fights',
      transcript: 'Here are the top 10 relics that will help you beat the Act 3 bosses...',
      thumbnail_url: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
      imported_at: hoursAgo(6),
    },
    {
      id: uuid(),
      url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      video_id: '9bZkp7q19f0',
      title: 'Ironclad Strength Build - Infinite Combo Guide',
      transcript: 'Today we are going to look at the Ironclad strength build...',
      thumbnail_url: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      imported_at: hoursAgo(24),
    },
    {
      id: uuid(),
      url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      video_id: 'kJQP7kiw5Fk',
      title: 'Silent Shiv Deck - Turn 1 Kill Setup',
      transcript: 'This Shiv deck is absolutely insane for turn 1 kills...',
      thumbnail_url: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      imported_at: hoursAgo(48),
    },
    {
      id: uuid(),
      url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
      video_id: 'JGwWNGJdvx8',
      title: 'Elden Ring Bleed Build 2024 - Rivers of Blood Guide',
      transcript: 'The Rivers of Blood bleed build is still one of the strongest in Elden Ring...',
      thumbnail_url: 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      imported_at: hoursAgo(72),
    },
  ];

  const makeFrontmatter = (title: string, desc: string, slug: string, tags: string[], category: string, img: string) => {
    const lines = [
      '---',
      `title: "${title}"`,
      `description: "${desc}"`,
      `slug: "${slug}"`,
      `category: "${category}"`,
      `date: "${now.toISOString().split('T')[0]}"`,
      `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
    ];
    if (img) lines.push(`image: "${img}"`);
    lines.push('---');
    lines.push('');
    lines.push('');
    return lines.join('\n');
  };

  const articles = [
    {
      id: uuid(),
      site_id: sites[0].id,
      title: 'Ultimate Poison Build Guide - Silent Archer A20 Heart Kill',
      slug: 'poison-build-guide-silent-a20',
      description: 'Master the Silent poison build to defeat the Corrupt Heart on Ascension 20.',
      tags: JSON.stringify(['poison', 'silent', 'ascension-20', 'build-guide']),
      category: 'build-guide',
      content:
        makeFrontmatter('Ultimate Poison Build Guide - Silent Archer A20', '', 'poison-build-guide-silent-a20', ['poison', 'silent'], 'build-guide', '') +
        `## Quick Overview\n\nThe Poison Silent build is one of the most consistent ways to beat A20 Heart.\n\n## Core Cards\n\n- Noxious Fumes (x2)\n- Catalyst (x2-3)\n- Corpse Explosion\n\n## Best Relics\n\n1. Snecko Skull\n2. The Specimen\n3. Toxic Egg`,
      frontmatter: '{}',
      youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      video_id: 'dQw4w9WgXcQ',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      seo_title: 'Ultimate Poison Build Guide | STS2 Builds',
      seo_description: 'Complete Silent poison build guide for A20 Heart kills.',
      status: 'published',
      created_at: hoursAgo(1),
      updated_at: hoursAgo(1),
    },
    {
      id: uuid(),
      site_id: sites[0].id,
      title: 'Top 10 Best Relics for Act 3 Boss Fights',
      slug: 'best-relics-act-3-tier-list',
      description: 'Comprehensive relic tier list for Act 3 bosses.',
      tags: JSON.stringify(['relics', 'tier-list', 'act-3']),
      category: 'tier-list',
      content: makeFrontmatter('Top 10 Best Relics for Act 3 Boss Fights', '', 'best-relics-act-3', ['relics', 'tier-list'], 'tier-list', '') + `## S-Tier\n\n- Dead Branch\n- Corruption\n- Wraith Form`,
      frontmatter: '{}',
      youtube_url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      video_id: 'jNQXAC9IVRw',
      thumbnail_url: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
      seo_title: 'Top 10 Best Relics for Act 3 | STS2 Builds',
      seo_description: 'Relic tier list for Act 3 bosses.',
      status: 'ai_generated',
      created_at: hoursAgo(5),
      updated_at: hoursAgo(5),
    },
    {
      id: uuid(),
      site_id: sites[0].id,
      title: 'Ironclad Strength Build - Infinite Combo Guide',
      slug: 'ironclad-strength-infinite-combo',
      description: 'Build the perfect Ironclad strength deck with Dropkick infinite combo.',
      tags: JSON.stringify(['ironclad', 'strength', 'build-guide']),
      category: 'build-guide',
      content: makeFrontmatter('Ironclad Strength Build', '', 'ironclad-strength-infinite-combo', ['ironclad', 'strength'], 'build-guide', '') + `## Overview\n\nThe Ironclad strength build leverages Limit Break and Spot Weakness.`,
      frontmatter: '{}',
      youtube_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      video_id: '9bZkp7q19f0',
      thumbnail_url: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      seo_title: 'Ironclad Strength Infinite Combo | STS2 Builds',
      seo_description: 'Max strength Ironclad with Dropkick infinite.',
      status: 'reviewed',
      created_at: hoursAgo(12),
      updated_at: hoursAgo(10),
    },
  ];

  for (const s of sites) {
    await dbAll(
      `INSERT OR REPLACE INTO sites (id, name, domain, repo_url, game_category, content_path, seo_title_template, seo_description_template, github_token, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.name, s.domain, s.repo_url, s.game_category, s.content_path, s.seo_title_template, s.seo_description_template, s.github_token, s.created_at, s.updated_at]
    );
  }

  for (const v of videos) {
    await dbAll(
      `INSERT OR REPLACE INTO youtube_videos (id, url, video_id, title, transcript, thumbnail_url, imported_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [v.id, v.url, v.video_id, v.title, v.transcript, v.thumbnail_url, v.imported_at]
    );
  }

  for (const a of articles) {
    await dbAll(
      `INSERT OR REPLACE INTO articles (id, site_id, title, slug, description, tags, category, content, frontmatter, youtube_url, video_id, thumbnail_url, seo_title, seo_description, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.id, a.site_id, a.title, a.slug, a.description, a.tags, a.category, a.content, a.frontmatter, a.youtube_url, a.video_id, a.thumbnail_url, a.seo_title, a.seo_description, a.status, a.created_at, a.updated_at]
    );
  }

  console.log('Seed complete!');
  console.log(`  Sites:     ${sites.length}`);
  console.log(`  Videos:    ${videos.length}`);
  console.log(`  Articles:  ${articles.length}`);
}

seed().catch(console.error);