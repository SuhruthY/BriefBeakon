import type { BriefBeaconConfig } from '../types';

const defaultConfig: BriefBeaconConfig = {
  scheduler: {
    times: ['07:00', '13:00', '19:00'],
    timezone: 'Asia/Kolkata',
  },
  categories: {
    ai: 3,
    technology: 2,
    business: 2,
    movies: 1,
    jobs: 1,
    sports: 1,
    general: 0,
  },
  sources: {
    rss: [],
    reddit: [],
    trending: {
      google_trends: true,
      github_trending: true,
    },
  },
  ai: {
    provider: 'openai',
    model: 'gpt-4o',
    max_tokens: 2048,
    temperature: 0.7,
  },
  site: {
    title: 'BriefBeakon',
    tagline: 'A Beacon for What Matters Today.',
    description: 'Your intelligent daily newspaper powered by AI.',
    url: 'https://suhruash.github.io/BriefBeakon',
    language: 'en',
  },
};

let cachedConfig: BriefBeaconConfig = defaultConfig;

export async function loadConfig(): Promise<BriefBeaconConfig> {
  try {
    const resp = await fetch('/BriefBeakon/config/briefbeacon.json');
    if (resp.ok) {
      const remote = await resp.json() as BriefBeaconConfig;
      cachedConfig = { ...defaultConfig, ...remote };
    }
  } catch {
    // Fall through to default
  }
  return cachedConfig;
}

export function getConfig(): BriefBeaconConfig {
  return cachedConfig;
}
