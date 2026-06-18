CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE article_category AS ENUM (
  'ai', 'technology', 'business', 'movies', 'jobs', 'sports', 'general'
);

CREATE TYPE publication_status AS ENUM (
  'draft', 'published', 'archived'
);

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category article_category NOT NULL,
  publication_date DATE NOT NULL,
  author TEXT NOT NULL DEFAULT 'BriefBeakon AI',
  content TEXT NOT NULL,
  key_takeaways TEXT[] DEFAULT '{}',
  public_sentiment TEXT,
  impact_analysis TEXT,
  future_outlook TEXT,
  tags TEXT[] DEFAULT '{}',
  source_url TEXT,
  source_name TEXT,
  sentiment_score REAL DEFAULT 0,
  status publication_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE movie_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  year INTEGER,
  overall_sentiment TEXT NOT NULL,
  what_viewers_liked TEXT[] DEFAULT '{}',
  common_criticisms TEXT[] DEFAULT '{}',
  ai_verdict TEXT NOT NULL,
  watch_recommendation TEXT NOT NULL,
  critic_score REAL,
  audience_score REAL,
  publication_date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  categories TEXT[] DEFAULT '{"ai","technology","business","movies","jobs","sports"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_generation_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL,
  articles_generated INTEGER DEFAULT 0,
  errors TEXT[] DEFAULT '{}',
  duration_seconds REAL
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_publication_date ON articles(publication_date DESC);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_movie_intelligence_date ON movie_intelligence(publication_date DESC);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_movie_intelligence_updated_at
  BEFORE UPDATE ON movie_intelligence
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
