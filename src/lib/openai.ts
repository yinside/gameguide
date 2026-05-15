import OpenAI from 'openai';

type AIProvider = 'openai' | 'deepseek';

interface ProviderConfig {
  provider: AIProvider;
  apiKey: string;
  baseURL: string;
  model: string;
}

let openaiClient: OpenAI | null = null;
let currentConfig: ProviderConfig | null = null;

function detectProvider(): ProviderConfig {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (deepseekKey) {
    return {
      provider: 'deepseek',
      apiKey: deepseekKey,
      baseURL: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat',
    };
  }

  if (openaiKey) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
    };
  }

  throw new Error(
    'No AI API key configured. Set DEEPSEEK_API_KEY or OPENAI_API_KEY environment variable.'
  );
}

function getOpenAI(): OpenAI {
  const config = detectProvider();

  if (!openaiClient || currentConfig?.apiKey !== config.apiKey) {
    openaiClient = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });
    currentConfig = config;
  }

  return openaiClient;
}

export function getCurrentModel(): string {
  return detectProvider().model;
}

export interface ArticleGenerationInput {
  transcript: string;
  videoTitle: string;
  gameCategory: string;
  siteName: string;
}

export interface GeneratedArticle {
  seoTitle: string;
  seoDescription: string;
  slug: string;
  tags: string[];
  markdown: string;
}

export async function generateArticle(
  input: ArticleGenerationInput
): Promise<GeneratedArticle> {
  const config = detectProvider();

  const systemPrompt = `You are an expert gaming strategy writer who creates high-quality, SEO-optimized guides.
Your writing style:
- Sounds human and conversational, like a pro gamer sharing tips
- Gamer-focused, information-dense, no filler or AI fluff
- Clear, direct, and actionable advice
- Uses gaming terminology naturally

You analyze video transcripts to extract the best strategies, builds, tips, and insights.
You write in markdown format with proper headings, lists, and emphasis.`;

  const userPrompt = `Create a complete gaming guide article based on this YouTube video transcript about "${input.gameCategory}".

Video title: ${input.videoTitle}
Site: ${input.siteName}

Transcript content:
${input.transcript.slice(0, 8000)}

Generate a complete article with the following structure in markdown:

1. Quick Overview - 2-3 sentences summarizing the build/strategy
2. Core Cards/Items - list the essential components
3. Best Relics/Equipment - optimal gear choices
4. Early Game Strategy - what to do first
5. Mid Game Strategy - key transitions
6. Late Game Scaling - how to close out
7. Boss Matchups - how to handle key encounters
8. Common Mistakes - pitfalls to avoid
9. Final Tips - expert advice

Also provide:
- SEO title (60 chars max)
- SEO description (160 chars max)
- URL slug
- 3-5 relevant tags

Format your response as JSON:
{
  "seoTitle": "...",
  "seoDescription": "...",
  "slug": "...",
  "tags": ["tag1", "tag2", "tag3"],
  "markdown": "full markdown article here"
}`;

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Failed to generate article content');
  }

  const parsed = JSON.parse(content);
  return {
    seoTitle: parsed.seoTitle || '',
    seoDescription: parsed.seoDescription || '',
    slug: parsed.slug || '',
    tags: parsed.tags || [],
    markdown: parsed.markdown || '',
  };
}