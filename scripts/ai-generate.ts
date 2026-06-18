import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { SourceItem } from './collect-sources.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', 'config', 'briefbeacon.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GeneratedArticle {
  title: string;
  summary: string;
  content: string;
  key_takeaways: string[];
  public_sentiment: string;
  impact_analysis: string;
  future_outlook: string;
  tags: string[];
}

async function generateWithAI(
  category: string,
  sources: SourceItem[],
): Promise<GeneratedArticle> {
  const sourceContext = sources
    .slice(0, 5)
    .map(s => `- ${s.title}: ${s.snippet}`)
    .join('\n');

  const prompt = `You are a professional journalist for BriefBeakon, an AI-powered digital newspaper.
Generate a news article for the "${category}" category.

Context from sources:
${sourceContext}

Generate a complete article with the following structure:
1. SEO-friendly headline
2. Summary (1-2 sentences)
3. Main article (3-5 paragraphs in professional journalistic style)
4. 3-5 key takeaways
5. Public sentiment summary
6. Impact analysis - why this matters
7. Future outlook - what could happen next
8. 3-5 relevant tags

Return as JSON with keys: title, summary, content, key_takeaways, public_sentiment, impact_analysis, future_outlook, tags`;

  const completion = await openai.chat.completions.create({
    model: config.ai.model || 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a professional journalist. Return valid JSON only.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: config.ai.max_tokens || 2048,
    temperature: config.ai.temperature || 0.7,
    response_format: { type: 'json_object' },
  });

  const text = completion.choices[0]?.message?.content || '{}';
  return JSON.parse(text) as GeneratedArticle;
}

export { generateWithAI };
