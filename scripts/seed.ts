import { getDb } from '../src/lib/db';
import { v4 as uuid } from 'uuid';

const db = getDb();

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

const articleFrontmatter = (title: string, desc: string, slug: string, tags: string[], category: string, img: string) => {
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
    description: 'Master the Silent poison build to defeat the Corrupt Heart on Ascension 20. Complete guide with card picks, relics, and boss strategies.',
    tags: JSON.stringify(['poison', 'silent', 'ascension-20', 'build-guide']),
    category: 'build-guide',
    content:
      articleFrontmatter(
        'Ultimate Poison Build Guide - Silent Archer A20 Heart Kill',
        'Master the Silent poison build to defeat the Corrupt Heart on Ascension 20.',
        'poison-build-guide-silent-a20',
        ['poison', 'silent', 'ascension-20', 'build-guide'],
        'build-guide',
        ''
      ) +
      `## Quick Overview

The Poison Silent build is one of the most consistent ways to beat A20 Heart. By stacking poison and using Catalyst to triple your damage output, you can melt bosses in just a few turns while blocking with your life.

## Core Cards

- **Noxious Fumes** (x2) - Your primary poison engine
- **Catalyst** (x2-3) - Triple your poison stacks
- **Corpse Explosion** - AoE clear + poison synergy
- **Bouncing Flask** - Quick burst poison application
- **Wraith Form** - Emergency survival

## Best Relics

1. **Snecko Skull** - +1 poison per application
2. **The Specimen** - Poison jumps on kill
3. **Toxic Egg** - Upgraded skills

## Early Game Strategy

Prioritize picking up at least one Noxious Fumes before Act 1 boss. Block with Survivor and Neutralize. Remove Strikes aggressively at shops.

## Mid Game Strategy

Once you have Catalyst, your scaling is online. Look for energy relics after Act 1 boss. Wraith Form becomes a priority pick in Act 2.

## Late Game Scaling

Against the Heart, focus on getting Wraith Form+ and bursting poison stacks before the invincibility wears off. Corpse Explosion clears the shield minions.

## Boss Matchups

- **Slime Boss**: Easy - poison ignores split mechanics
- **Collector**: Corpse Explosion trivializes the minions
- **Time Eater**: Play 12 cards per turn max, let poison do the work

## Common Mistakes

- Picking too many attack cards early
- Not removing Strikes fast enough
- Skipping Catalyst when offered

## Final Tips

Don't be greedy with Catalyst - sometimes 2 is enough. Wraith Form + Apparitions is the most broken combo in the game.`,
    frontmatter: '{}',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    seo_title: 'Ultimate Poison Build Guide - Silent A20 Heart Kill | STS2 Builds',
    seo_description: 'Complete Silent poison build guide for Ascension 20 Heart kills. Card picks, relic choices, boss strategies, and common mistakes.',
    status: 'published',
    created_at: hoursAgo(1),
    updated_at: hoursAgo(1),
  },
  {
    id: uuid(),
    site_id: sites[0].id,
    title: 'Top 10 Best Relics for Act 3 Boss Fights - Tier List',
    slug: 'best-relics-act-3-tier-list',
    description: 'Comprehensive relic tier list for Act 3 bosses. Learn which relics give you the best chance against Time Eater, Awakened One, and Donu & Deca.',
    tags: JSON.stringify(['relics', 'tier-list', 'act-3', 'boss-guide']),
    category: 'tier-list',
    content:
      articleFrontmatter(
        'Top 10 Best Relics for Act 3 Boss Fights - Tier List',
        'Comprehensive relic tier list for Act 3 bosses.',
        'best-relics-act-3-tier-list',
        ['relics', 'tier-list', 'act-3', 'boss-guide'],
        'tier-list',
        ''
      ) +
      `## Quick Overview

Choosing the right relics can make or break your Act 3 boss fights. This tier list ranks the most impactful relics based on win rate data and pro player consensus.

## S-Tier Relics

- **Dead Branch** - Generates infinite value
- **Corruption** - Turns skills into free damage
- **Wraith Form** - 3 turns of invincibility

## A-Tier Relics

- **Mummified Hand** - Makes powers free
- **Ice Cream** - Energy banking for big turns
- **Incense Burner** - Free intangible every 6 turns`,
    frontmatter: '{}',
    youtube_url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    video_id: 'jNQXAC9IVRw',
    thumbnail_url: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    seo_title: 'Top 10 Best Relics for Act 3 Boss Fights | STS2 Builds',
    seo_description: 'S-Tier to B-Tier relic rankings for Act 3 bosses. Data-driven analysis with win rate statistics.',
    status: 'ai_generated',
    created_at: hoursAgo(5),
    updated_at: hoursAgo(5),
  },
  {
    id: uuid(),
    site_id: sites[0].id,
    title: 'Ironclad Strength Build - Infinite Combo Guide',
    slug: 'ironclad-strength-infinite-combo',
    description: 'Build the perfect Ironclad strength deck with Dropkick infinite combo. Complete card tier list and pathing guide.',
    tags: JSON.stringify(['ironclad', 'strength', 'infinite-combo', 'build-guide']),
    category: 'build-guide',
    content:
      articleFrontmatter(
        'Ironclad Strength Build - Infinite Combo Guide',
        'Build the perfect Ironclad strength deck with Dropkick infinite combo.',
        'ironclad-strength-infinite-combo',
        ['ironclad', 'strength', 'infinite-combo', 'build-guide'],
        'build-guide',
        ''
      ) +
      `## Quick Overview

The Ironclad strength build leverages Limit Break and Spot Weakness to scale strength into the stratosphere, then converts that into lethal damage with multi-hit attacks like Heavy Blade and Sword Boomerang.`,
    frontmatter: '{}',
    youtube_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    video_id: '9bZkp7q19f0',
    thumbnail_url: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    seo_title: 'Ironclad Strength Infinite Combo Build Guide | STS2 Builds',
    seo_description: 'Max strength Ironclad with Dropkick infinite. Card picks, relic synergy, and boss strategies.',
    status: 'reviewed',
    created_at: hoursAgo(12),
    updated_at: hoursAgo(10),
  },
  {
    id: uuid(),
    site_id: sites[1].id,
    title: 'Patch 14.8 Jungle Tier List - Best Champions to Climb',
    slug: 'lol-patch-14-8-jungle-tier-list',
    description: 'Updated tier list for jungle in Patch 14.8. Includes S-tier to C-tier with matchup analysis and ban recommendations.',
    tags: JSON.stringify(['lol', 'jungle', 'tier-list', 'patch-14-8']),
    category: 'tier-list',
    content:
      articleFrontmatter(
        'Patch 14.8 Jungle Tier List - Best Champions to Climb',
        'Updated tier list for jungle in Patch 14.8.',
        'lol-patch-14-8-jungle-tier-list',
        ['lol', 'jungle', 'tier-list', 'patch-14-8'],
        'tier-list',
        ''
      ) +
      `## Quick Overview

Patch 14.8 brought significant jungle changes. Lee Sin and Graves dominate the meta, while tank junglers like Sejuani are making a comeback. Here's your complete tier list.

## S-Tier (Must Pick/Ban)

- **Lee Sin** - Unmatched early pressure
- **Graves** - Best scaling jungler currently
- **Karthus** - Power farming monster`,
    frontmatter: '{}',
    youtube_url: '',
    video_id: '',
    thumbnail_url: '',
    seo_title: 'Patch 14.8 Jungle Tier List - Best Champions | LoL Meta Hub',
    seo_description: 'Complete jungle tier list for Patch 14.8 with matchup analysis and climb recommendations.',
    status: 'published',
    created_at: hoursAgo(36),
    updated_at: hoursAgo(36),
  },
  {
    id: uuid(),
    site_id: sites[2].id,
    title: 'Elden Ring Rivers of Blood Bleed Build 2024 Guide',
    slug: 'elden-ring-rivers-of-blood-bleed-build-2024',
    description: 'Still overpowered in 2024. Complete Rivers of Blood build with stats, talismans, armor, and boss strategies for PvE and PvP.',
    tags: JSON.stringify(['elden-ring', 'bleed', 'rivers-of-blood', 'build-guide']),
    category: 'build-guide',
    content:
      articleFrontmatter(
        'Elden Ring Rivers of Blood Bleed Build 2024 Guide',
        'Complete Rivers of Blood build for 2024.',
        'elden-ring-rivers-of-blood-bleed-build-2024',
        ['elden-ring', 'bleed', 'rivers-of-blood', 'build-guide'],
        'build-guide',
        ''
      ) +
      `## Quick Overview

Despite nerfs, Rivers of Blood remains a top-tier weapon in Elden Ring 2024. With the right talismans and stat allocation, you can proc bleed in 2-3 hits and melt bosses.

## Core Build

- **Weapon**: Rivers of Blood +10
- **Off-hand**: Uchigatana (Occult) or Seal for buffs
- **Armor**: White Mask (10% damage boost on bleed)`,
    frontmatter: '{}',
    youtube_url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    video_id: 'JGwWNGJdvx8',
    thumbnail_url: 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
    seo_title: 'Elden Ring Rivers of Blood Bleed Build Guide 2024',
    seo_description: 'Rivers of Blood bleed build for Elden Ring 2024. Stats, talismans, armor, and PvE/PvP strategies.',
    status: 'draft',
    created_at: hoursAgo(60),
    updated_at: hoursAgo(60),
  },
  {
    id: uuid(),
    site_id: sites[2].id,
    title: 'Elden Ring Shadow of the Erdtree - Best New Weapons Ranked',
    slug: 'elden-ring-sote-best-weapons-ranked',
    description: 'All new weapons from Shadow of the Erdtree DLC ranked and reviewed. Find the best new armaments for your build.',
    tags: JSON.stringify(['elden-ring', 'dlc', 'weapons', 'tier-list', 'shadow-of-the-erdtree']),
    category: 'tier-list',
    content:
      articleFrontmatter(
        'Shadow of the Erdtree - Best New Weapons Ranked',
        'All new weapons from Shadow of the Erdtree DLC ranked.',
        'elden-ring-sote-best-weapons-ranked',
        ['elden-ring', 'dlc', 'weapons', 'tier-list', 'shadow-of-the-erdtree'],
        'tier-list',
        ''
      ) +
      `## S-Tier Weapons

- **Rellana's Twin Blades** - Insane DPS with the new stance moveset
- **Milady** - Best light greatsword, incredible range`,
    frontmatter: '{}',
    youtube_url: '',
    video_id: '',
    thumbnail_url: '',
    seo_title: 'Shadow of the Erdtree - Best New Weapons Ranked | Elden Ring Guides',
    seo_description: 'Every new SOTE weapon ranked from S-tier to D-tier. Find the best armaments for your build.',
    status: 'ai_generated',
    created_at: hoursAgo(80),
    updated_at: hoursAgo(80),
  },
];

const insertSite = db.prepare(`
  INSERT OR REPLACE INTO sites (id, name, domain, repo_url, game_category, content_path, seo_title_template, seo_description_template, github_token, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertVideo = db.prepare(`
  INSERT OR REPLACE INTO youtube_videos (id, url, video_id, title, transcript, thumbnail_url, imported_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertArticle = db.prepare(`
  INSERT OR REPLACE INTO articles (id, site_id, title, slug, description, tags, category, content, frontmatter, youtube_url, video_id, thumbnail_url, seo_title, seo_description, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const tx = db.transaction(() => {
  for (const s of sites) {
    insertSite.run(s.id, s.name, s.domain, s.repo_url, s.game_category, s.content_path, s.seo_title_template, s.seo_description_template, s.github_token, s.created_at, s.updated_at);
  }

  for (const v of videos) {
    insertVideo.run(v.id, v.url, v.video_id, v.title, v.transcript, v.thumbnail_url, v.imported_at);
  }

  for (const a of articles) {
    insertArticle.run(
      a.id, a.site_id, a.title, a.slug, a.description, a.tags, a.category,
      a.content, a.frontmatter, a.youtube_url, a.video_id, a.thumbnail_url,
      a.seo_title, a.seo_description, a.status, a.created_at, a.updated_at
    );
  }
});

tx();

console.log('Seed complete!');
console.log(`  Sites:     ${sites.length}`);
console.log(`  Videos:    ${videos.length}`);
console.log(`  Articles:  ${articles.length}`);
console.log('');
console.log('Dashboard should now show:');
console.log('  - 3 gaming sites (STS2 Builds, LoL Meta Hub, Elden Ring Guides)');
console.log('  - 5 YouTube imports');
console.log('  - 6 articles (2 published, 2 AI generated, 1 reviewed, 1 draft)');