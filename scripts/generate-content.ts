import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', 'config', 'briefbeacon.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

interface Article {
  slug: string;
  title: string;
  summary: string;
  category: string;
  publication_date: string;
  author: string;
  content: string;
  key_takeaways: string[];
  public_sentiment: string;
  impact_analysis: string;
  future_outlook: string;
  tags: string[];
}

async function generateArticle(category: string): Promise<Article> {
  const today = new Date().toISOString().split('T')[0];
  const slug = `${today}-${category}-${Math.random().toString(36).slice(2, 8)}`;

  const article: Article = {
    slug,
    title: `[Sample] ${category} Update - ${today}`,
    summary: `This is a sample article for the ${category} category. Replace with AI-generated content.`,
    category,
    publication_date: today,
    author: 'BriefBeakon AI',
    content: 'This is placeholder content. The AI generation module will produce full articles here.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    key_takeaways: [
      'Key development in this area',
      'Important trend to watch',
      'Expert consensus emerging',
    ],
    public_sentiment: 'Public reaction has been mixed, with many expressing cautious optimism about recent developments.',
    impact_analysis: 'This development could significantly reshape the industry landscape over the coming months.',
    future_outlook: 'Experts predict continued evolution in this space, with several major announcements expected.',
    tags: [category, 'trending', 'analysis'],
  };

  return article;
}

async function saveArticle(article: Article): Promise<void> {
  const postsDir = join(__dirname, '..', 'content', 'posts');
  mkdirSync(postsDir, { recursive: true });

  const filePath = join(postsDir, `${article.slug}.md`);
  const content = `---
title: "${article.title}"
category: ${article.category}
date: ${article.publication_date}
author: ${article.author}
tags: [${article.tags.map(t => `"${t}"`).join(', ')}]
slug: ${article.slug}
---

# ${article.title}

${article.summary}

## Full Article

${article.content}

## Key Takeaways

${article.key_takeaways.map(k => `- ${k}`).join('\n')}

## Public Sentiment

${article.public_sentiment}

## Impact Analysis

${article.impact_analysis}

## Future Outlook

${article.future_outlook}
`;

  writeFileSync(filePath, content, 'utf-8');
  console.log(`Saved: ${filePath}`);
}

async function main() {
  console.log('Starting BriefBeakon content generation...');
  console.log(`Config: ${JSON.stringify(config.scheduler)}`);

  const { categories } = config;

  for (const [category, count] of Object.entries(categories)) {
    const numArticles = count as number;
    console.log(`Generating ${numArticles} article(s) for category: ${category}`);

    for (let i = 0; i < numArticles; i++) {
      const article = await generateArticle(category);
      await saveArticle(article);
    }
  }

  console.log('Content generation complete.');
}

main().catch(console.error);
