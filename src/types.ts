export type Category = 'ai' | 'technology' | 'business' | 'movies' | 'jobs' | 'sports' | 'general';

export interface SourceLink {
  title: string;
  url: string;
  domain: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: Category;
  publication_date: string;
  author: string;
  content: string;
  word_count: number;
  key_takeaways: string[];
  public_sentiment: string;
  impact_analysis: string;
  future_outlook: string;
  tags: string[];
  source_links: SourceLink[];
  meta_description: string;
  keywords: string[];
  source_url: string;
  source_name: string;
  sentiment_score: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface MovieIntelligence {
  id: string;
  title: string;
  slug: string;
  year: number;
  overall_sentiment: string;
  what_viewers_liked: string[];
  common_criticisms: string[];
  ai_verdict: string;
  watch_recommendation: string;
  critic_score: number;
  audience_score: number;
  publication_date: string;
  tags: string[];
}

export interface UserPreferences {
  user_id: string;
  categories: Category[];
}

export interface BriefBeaconConfig {
  scheduler: {
    times: string[];
    timezone: string;
    initial_fill?: {
      enabled: boolean;
      date: string;
      interval_minutes: number;
      articles_per_run: number;
    };
  };
  categories: Record<Category, number>;
  sources: {
    rss: string[];
    reddit: string[];
    trending: {
      google_trends: boolean;
      github_trending: boolean;
    };
  };
  ai: {
    provider: 'openai' | 'gemini';
    model: string;
    max_tokens: number;
    temperature: number;
  };
  site: {
    title: string;
    tagline: string;
    description: string;
    url: string;
    language: string;
  };
}

export const CATEGORY_LABELS: Record<Category, string> = {
  ai: 'Artificial Intelligence',
  technology: 'Technology',
  business: 'Business',
  movies: 'Movies & Entertainment',
  jobs: 'Jobs & Careers',
  sports: 'Sports',
  general: 'General',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  ai: 'from-violet-500 to-purple-600',
  technology: 'from-cyan-500 to-blue-600',
  business: 'from-emerald-500 to-green-600',
  movies: 'from-pink-500 to-rose-600',
  jobs: 'from-amber-500 to-orange-600',
  sports: 'from-sky-500 to-indigo-600',
  general: 'from-slate-500 to-gray-600',
};
