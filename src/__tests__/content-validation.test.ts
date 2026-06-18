import { describe, it, expect } from 'vitest'
import articles from '../../public/data/articles.json'
import movies from '../../public/data/movies.json'
import type { MovieIntelligence } from '../types'

type RawArticle = {
  slug: string
  title: string
  summary: string
  content: string
  category: string
  publication_date: string
  author: string
  word_count: number
  key_takeaways: string[]
  public_sentiment: string
  impact_analysis: string
  future_outlook: string
  tags: string[]
  source_links?: Array<{ title: string; url: string; domain: string }>
  meta_description: string
  keywords: string[]
  source_url: string
  source_name: string
  sentiment_score: number
  status: string
}

const REQUIRED_ARTICLE_FIELDS: (keyof RawArticle)[] = [
  'slug', 'title', 'summary', 'content', 'category',
  'author', 'publication_date', 'word_count', 'key_takeaways',
  'tags', 'meta_description',
]

const REQUIRED_MOVIE_FIELDS: (keyof MovieIntelligence)[] = [
  'id', 'title', 'year', 'critic_score', 'audience_score',
  'overall_sentiment', 'what_viewers_liked', 'common_criticisms',
  'ai_verdict', 'watch_recommendation',
]

describe('articles.json', () => {
  it('has at least 1 article', () => {
    expect(articles.length).toBeGreaterThanOrEqual(1)
  })

  it.each(articles)('article "$title" has all required fields', (article: RawArticle) => {
    for (const field of REQUIRED_ARTICLE_FIELDS) {
      expect(article).toHaveProperty(field)
      expect(article[field as keyof typeof article]).not.toBeNull()
      expect(article[field as keyof typeof article]).not.toBeUndefined()
    }
  })

  it.each(articles)('article "$title" has word_count > 200', (article: RawArticle) => {
    expect(article.word_count).toBeGreaterThan(200)
  })

  it.each(articles)('article "$title" has at least 1 key_takeaway', (article: RawArticle) => {
    expect(article.key_takeaways.length).toBeGreaterThanOrEqual(1)
  })

  it.each(articles)('article "$title" has at least 1 tag', (article: RawArticle) => {
    expect(article.tags.length).toBeGreaterThanOrEqual(1)
  })

  it.each(articles)('article "$title" has a non-empty slug', (article: RawArticle) => {
    expect(article.slug.length).toBeGreaterThan(0)
  })

  it.each(articles)('article "$title" has a valid publication_date', (article: RawArticle) => {
    const date = new Date(article.publication_date)
    expect(date.getTime()).not.toBeNaN()
  })

  it('no duplicate slugs', () => {
    const slugs = articles.map((a: RawArticle) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('each article has at least 800 words', () => {
    for (const article of articles as RawArticle[]) {
      expect(article.word_count).toBeGreaterThanOrEqual(800)
    }
  })

  it('each article has tags as array', () => {
    for (const article of articles as RawArticle[]) {
      expect(Array.isArray(article.tags)).toBe(true)
    }
  })

  it('each article has key_takeaways as array', () => {
    for (const article of articles as RawArticle[]) {
      expect(Array.isArray(article.key_takeaways)).toBe(true)
    }
  })

  it('each article with source_links has valid structure', () => {
    for (const article of articles as RawArticle[]) {
      if (article.source_links && article.source_links.length > 0) {
        for (const link of article.source_links) {
          expect(link).toHaveProperty('title')
          expect(link).toHaveProperty('url')
          expect(link).toHaveProperty('domain')
        }
      }
    }
  })
})

describe('movies.json', () => {
  it('has at least 1 movie', () => {
    expect(movies.length).toBeGreaterThanOrEqual(1)
  })

  it.each(movies)('movie "$title" has all required fields', (movie: Record<string, unknown>) => {
    for (const field of REQUIRED_MOVIE_FIELDS) {
      expect(movie).toHaveProperty(field)
      expect(movie[field]).not.toBeNull()
      expect(movie[field]).not.toBeUndefined()
    }
  })

  it.each(movies)('movie "$title" has critic_score >= 0', (movie: MovieIntelligence) => {
    expect(movie.critic_score).toBeGreaterThanOrEqual(0)
  })

  it.each(movies)('movie "$title" has audience_score >= 0', (movie: MovieIntelligence) => {
    expect(movie.audience_score).toBeGreaterThanOrEqual(0)
  })

  it.each(movies)('movie "$title" has at least 1 liked item', (movie: MovieIntelligence) => {
    expect(movie.what_viewers_liked.length).toBeGreaterThanOrEqual(1)
  })

  it.each(movies)('movie "$title" has at least 1 criticism', (movie: MovieIntelligence) => {
    expect(movie.common_criticisms.length).toBeGreaterThanOrEqual(1)
  })

  it.each(movies)('movie "$title" has a non-empty ai_verdict', (movie: MovieIntelligence) => {
    expect(movie.ai_verdict.length).toBeGreaterThan(0)
  })

  it.each(movies)('movie "$title" has a non-empty watch_recommendation', (movie: MovieIntelligence) => {
    expect(movie.watch_recommendation.length).toBeGreaterThan(0)
  })

  it('no duplicate movie IDs', () => {
    const ids = (movies as MovieIntelligence[]).map(m => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each movie has year >= 2024', () => {
    for (const movie of movies as MovieIntelligence[]) {
      expect(movie.year).toBeGreaterThanOrEqual(2024)
    }
  })

  it('each movie has what_viewers_liked as array', () => {
    for (const movie of movies as MovieIntelligence[]) {
      expect(Array.isArray(movie.what_viewers_liked)).toBe(true)
    }
  })

  it('each movie has common_criticisms as array', () => {
    for (const movie of movies as MovieIntelligence[]) {
      expect(Array.isArray(movie.common_criticisms)).toBe(true)
    }
  })
})
