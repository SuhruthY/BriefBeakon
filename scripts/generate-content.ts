import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', 'config', 'briefbeacon.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

const HEADLINES: Record<string, string[]> = {
  ai: [
    'OpenAI Unveils GPT-5 with Breakthrough Reasoning Capabilities',
    'DeepMind\'s New AI Solves Decade-Old Biology Problem',
    'Meta Releases Open-Source LLM Challenging GPT-4 Performance',
    'AI Regulation Framework Adopted by G20 Nations',
    'Self-Driving Taxis Launch in Major European Cities',
    'New AI Model Can Predict Protein Structures in Minutes',
  ],
  technology: [
    'Apple Vision Pro 2 Ships With Half the Weight, Double the Battery',
    'TSMC Begins Mass Production of 1nm Chips',
    'Quantum Computer Achieves First Error-Corrected Million-Qubit Milestone',
    'Starlink Reaches 10 Million Subscribers Globally',
    'World\'s First Fully 3D-Printed Bridge Opens in Amsterdam',
    'New Battery Technology Promises 1000km EV Range',
  ],
  business: [
    'Global Markets Rally as Inflation Drops to 2% Target',
    'Nvidia Becomes First Trillion-Dollar Chip Company',
    'Central Banks Launch Digital Currency Pilot Programs',
    'Remote Work Revolution: 40% of Fortune 500 Now Fully Distributed',
    'Green Energy Investments Surpass Oil and Gas for First Time',
    'Global Trade Deal Signed Between US, EU, and India',
  ],
  movies: [
    'Christopher Nolan\'s Latest Sci-Fi Epic Breaks Opening Weekend Records',
    'Streaming Wars: Netflix Hits 400 Million Subscribers',
    'AI-Generated Film Wins Award at Cannes Film Festival',
    'Marvel Announces Next Saga: The Age of Heroes',
    'Independent Cinema Sees Renaissance as Audiences Seek Original Stories',
    'Virtual Production Technology Transforms Hollywood Filmmaking',
  ],
  jobs: [
    'AI Creates 2 Million New Tech Jobs While Replacing Routine Roles',
    'Four-Day Work Week Adopted by 30% of Fortune 500 Companies',
    'Global Skill Gap: Countries Race to Reskill Workers for AI Economy',
    'Remote Work Creates New Opportunities for Rural Employment',
    'Tech Salary Transparency Laws Transform Hiring Practices',
    'Gig Economy Workers Gain New Rights and Benefits',
  ],
  sports: [
    'AI Referee System Officially Adopted by FIFA for World Cup 2026',
    'Olympics Add Esports as Official Medal Event for 2028',
    'Record-Breaking Viewership for Cricket World Cup Final',
    'Formula E Overtakes Traditional Motorsports in Global Fan Base',
    'Smart Stadium Technology Enhances Fan Experience Worldwide',
    'New Generation of Athletes Breaks Decade-Old World Records',
  ],
};

const KEY_TAKEAWAYS: Record<string, string[]> = {
  ai: [
    'AI capabilities are advancing faster than regulatory frameworks can adapt',
    'Open-source AI models are democratizing access to cutting-edge technology',
    'Industry leaders emphasize the need for responsible AI development',
    'Investment in AI infrastructure reached record levels this quarter',
    'Cross-border collaboration on AI safety standards is increasing',
  ],
  technology: [
    'Hardware innovations continue to outpace software optimization',
    'The semiconductor supply chain is stabilizing after years of disruption',
    'Consumer adoption of next-gen technology is accelerating rapidly',
    'Sustainability is becoming a key driver of technology innovation',
    'Open standards are winning over proprietary ecosystems',
  ],
  business: [
    'Digital transformation is moving from optional to essential for survival',
    'Sustainable business practices correlate strongly with market performance',
    'Global trade realignment creates both challenges and opportunities',
    'Workforce demographics are shifting dramatically across industries',
    'Consumer behavior changes are reshaping traditional business models',
  ],
  movies: [
    'Streaming platforms are investing heavily in original content',
    'AI tools are becoming standard in post-production workflows',
    'Global box office recovery exceeds pre-pandemic projections',
    'Audience demand for diverse storytelling continues to grow',
    'Theatrical and streaming releases are finding new equilibrium',
  ],
  jobs: [
    'The nature of work is undergoing its most significant transformation since the industrial revolution',
    'Lifelong learning has become essential for career sustainability',
    'Geographic flexibility is redefining talent markets',
    'Worker protections are evolving to match new employment models',
    'Soft skills are increasingly valued alongside technical expertise',
  ],
  sports: [
    'Technology integration is fundamentally changing how sports are played and watched',
    'Athlete wellness and data-driven training are becoming standard practice',
    'Fan engagement platforms are creating new revenue streams',
    'Sustainability initiatives are transforming sports infrastructure',
    'Global viewership patterns show increasing interest in diverse sports',
  ],
};

const SENTIMENTS = [
  'Public reaction has been overwhelmingly positive, with social media buzz reaching record levels. Enthusiasts praise the innovation while experts call for measured adoption.',
  'The response has been mixed, with early adopters expressing excitement while regulators urge caution. Industry analysts are closely watching market reactions.',
  'Community sentiment is highly optimistic. Discussion forums are abuzz with speculation about long-term implications, though some raise valid concerns about equitable access.',
  'Public discourse reflects a cautious optimism. While many celebrate the advancement, there is growing dialogue around responsible implementation and potential societal impacts.',
];

const IMPACTS = [
  'This development is expected to reshape the industry landscape, creating new opportunities while disrupting established players. Market analysts project significant economic impact over the next 12-18 months.',
  'The implications extend far beyond the immediate sector, affecting supply chains, consumer behavior, and regulatory frameworks globally. Early adopters stand to gain significant competitive advantage.',
  'This marks a pivotal moment that could accelerate or redirect ongoing industry trends. The ripple effects are likely to be felt across adjacent sectors and international markets.',
  'Analysts describe this as a paradigm shift that fundamentally changes the competitive dynamics. Companies that fail to adapt risk obsolescence, while innovators may capture substantial market share.',
];

const OUTLOOKS = [
  'Experts predict accelerated adoption over the coming months, with several major announcements expected from competitors. Regulatory frameworks are expected to evolve to keep pace with innovation.',
  'The trajectory suggests rapid evolution with multiple players entering the space. Industry consortiums are forming to establish standards and best practices for the sector.',
  'Looking ahead, continued innovation is expected with convergence across multiple technologies. International cooperation will likely play a crucial role in shaping the future direction.',
  'The next 12 months are expected to bring significant developments as the technology matures and adoption scales. Market consolidation is anticipated as the sector matures.',
];

const TAGS_POOL = [
  'innovation', 'technology', 'trending', 'analysis', 'industry', 'global',
  'future', 'digital', 'transformation', 'breakthrough', 'development',
  'market', 'investment', 'growth', 'regulation', 'sustainability',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateContent(): string {
  const paragraphs = Math.floor(Math.random() * 3) + 4;
  const content: string[] = [];
  const templates = [
    'In a significant development that has captured global attention, industry leaders and experts are weighing in on the latest advancements. This marks a pivotal moment in the ongoing evolution of the sector.',
    'According to multiple sources familiar with the matter, the implications of this development extend far beyond initial expectations. Industry analysts have been quick to note the potential for widespread disruption.',
    'Speaking at a press conference, key stakeholders emphasized the transformative potential of this development. "This is just the beginning," said one industry expert. "We are witnessing a fundamental shift in how the industry operates."',
    'Data from multiple independent research firms confirms the accelerating trend. Adoption rates have exceeded even the most optimistic projections, signaling strong market confidence in the direction of travel.',
    'However, challenges remain. Industry observers point to regulatory hurdles, infrastructure requirements, and the need for skilled talent as key factors that could influence the pace of adoption.',
    'The competitive landscape is evolving rapidly, with both established players and startups racing to capitalize on the opportunity. Strategic partnerships and acquisitions are expected to accelerate in the coming months.',
    'Consumer response has been noteworthy, with early adoption patterns suggesting strong market fit. User engagement metrics and satisfaction scores indicate positive reception across demographic segments.',
    'International perspectives add another layer of complexity to the story. Different regions are approaching the development with varying strategies, reflecting diverse priorities and regulatory environments.',
  ];

  for (let i = 0; i < paragraphs; i++) {
    content.push(pick(templates));
  }

  return content.join('\n\n');
}

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

function generateArticle(category: string): Article {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const timestamp = Date.now();
  const slug = `${dateStr}-${category}-${timestamp.toString(36)}`;

  const headlines = HEADLINES[category] || HEADLINES['technology'];
  const takeaways = KEY_TAKEAWAYS[category] || KEY_TAKEAWAYS['technology'];

  const copy = today.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return {
    slug,
    title: pick(headlines),
    summary: `In today's edition (${copy}): A major development in ${category} is making headlines worldwide. Here's everything you need to know about this significant story and why it matters.`,
    category,
    publication_date: dateStr,
    author: 'BriefBeakon AI',
    content: generateContent(),
    key_takeaways: pickN(takeaways, 3 + Math.floor(Math.random() * 2)),
    public_sentiment: pick(SENTIMENTS),
    impact_analysis: pick(IMPACTS),
    future_outlook: pick(OUTLOOKS),
    tags: pickN(TAGS_POOL, 3 + Math.floor(Math.random() * 3)),
  };
}

function saveArticle(article: Article): void {
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
summary: "${article.summary}"
---

# ${article.title}

**${article.summary}**

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
  console.log(`  Saved: ${filePath}`);
}

function saveStaticData(articles: Article[]): void {
  const dataDir = join(__dirname, '..', 'public', 'data');
  mkdirSync(dataDir, { recursive: true });

  const articlesPath = join(dataDir, 'articles.json');
  writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf-8');
  console.log(`  Saved static data: ${articlesPath}`);
}

interface ContentState {
  articles: Article[];
}

function loadState(): ContentState {
  const statePath = join(__dirname, '..', 'content', 'state.json');
  if (existsSync(statePath)) {
    try {
      return JSON.parse(readFileSync(statePath, 'utf-8')) as ContentState;
    } catch { /* ignore */ }
  }
  return { articles: [] };
}

function saveState(state: ContentState): void {
  const statePath = join(__dirname, '..', 'content', 'state.json');
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf-8');
}

async function main() {
  console.log('Starting BriefBeakon content generation...');
  console.log(`Config: schedule=${JSON.stringify(config.scheduler)}`);

  const { categories } = config;
  const state = loadState();
  const existingSlugs = new Set(state.articles.map(a => a.slug));
  const newArticles: Article[] = [];

  const isFillMode = process.argv.includes('--fill');

  for (const [category, count] of Object.entries(categories)) {
    const numArticles = isFillMode ? (count as number) : 1;
    console.log(`Generating ${numArticles} article(s) for: ${category}`);

    for (let i = 0; i < numArticles; i++) {
      const article = generateArticle(category);
      if (!existingSlugs.has(article.slug)) {
        saveArticle(article);
        newArticles.push(article);
      }
    }
  }

  if (newArticles.length > 0) {
    state.articles.push(...newArticles);
    saveState(state);
    saveStaticData(state.articles);
    // Also save just today's articles for the frontend
    saveStaticData(state.articles);
  }

  console.log(`Done. Generated ${newArticles.length} new article(s). Total: ${state.articles.length}`);
}

main().catch(console.error);
