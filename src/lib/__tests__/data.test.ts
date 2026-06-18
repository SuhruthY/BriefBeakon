import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getPublishedArticles, getArticleBySlug, getArticlesByCategory, getMovies, resetDataCache } from '../data'
import type { Article, MovieIntelligence, Category } from '../../types'

const T_CATEGORY = 'technology' as Category
const S_CATEGORY = 'sports' as Category

const mockArticles: Article[] = [
  {
    slug: 'test-article-1',
    title: 'Test Article 1',
    summary: 'Summary 1',
    content: 'Content 1',
    category: T_CATEGORY,
    author: 'AI',
    publication_date: '2026-06-18',
    word_count: 1000,
    key_takeaways: ['Takeaway 1'],
    tags: ['tech'],
    meta_description: 'Meta 1',
    public_sentiment: 'Positive',
    impact_analysis: 'High',
    future_outlook: 'Bright',
    keywords: ['tech'],
    source_links: [],
    source_url: '',
    source_name: '',
    sentiment_score: 0.5,
  },
  {
    slug: 'test-article-2',
    title: 'Test Article 2',
    summary: 'Summary 2',
    content: 'Content 2',
    category: S_CATEGORY,
    author: 'AI',
    publication_date: '2026-06-17',
    word_count: 800,
    key_takeaways: ['Takeaway A'],
    tags: ['sports'],
    meta_description: 'Meta 2',
    public_sentiment: 'Neutral',
    impact_analysis: 'Medium',
    future_outlook: 'Stable',
    keywords: ['sports'],
    source_links: [],
    source_url: '',
    source_name: '',
    sentiment_score: 0.3,
  },
  {
    slug: 'test-article-1',
    title: 'Duplicate',
    summary: 'Should be deduped',
    content: 'Content',
    category: T_CATEGORY,
    author: 'AI',
    publication_date: '2026-06-16',
    word_count: 500,
    key_takeaways: ['X'],
    tags: ['x'],
    meta_description: 'Meta dup',
    public_sentiment: 'Negative',
    impact_analysis: 'Low',
    future_outlook: 'Unclear',
    keywords: ['x'],
    source_links: [],
    source_url: '',
    source_name: '',
    sentiment_score: 0.1,
  },
]

const mockMovies: MovieIntelligence[] = [
  {
    id: 'm1',
    title: 'Test Movie',
    slug: 'test-movie',
    year: 2026,
    critic_score: 85,
    audience_score: 78,
    overall_sentiment: 'Positive',
    what_viewers_liked: ['Great acting'],
    common_criticisms: ['Slow pacing'],
    ai_verdict: 'Worth watching',
    watch_recommendation: 'Watch in theaters',
    publication_date: '2026-06-18',
    tags: ['action'],
  },
]

describe('getPublishedArticles', () => {
  beforeEach(() => {
    resetDataCache()
    vi.stubGlobal('import.meta', { env: { DEV: true, BASE_URL: '/BriefBeakon/' } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns articles from JSON fetch', async () => {
    const mock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockArticles),
    })
    vi.stubGlobal('fetch', mock)

    const result = await getPublishedArticles()
    expect(result).toHaveLength(2)
    expect(result[0].slug).toBe('test-article-1')
    expect(result[0].publication_date).toBe('2026-06-18')
    expect(result[1].slug).toBe('test-article-2')
  })

  it('returns empty array on fetch error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    const result = await getPublishedArticles()
    expect(result).toEqual([])
  })

  it('returns empty array on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await getPublishedArticles()
    expect(result).toEqual([])
  })

  it('caches result on second call', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockArticles),
    })
    vi.stubGlobal('fetch', mockFetch)

    await getPublishedArticles()
    await getPublishedArticles()
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('deduplicates articles by slug, keeping the latest', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockArticles),
    }))

    const result = await getPublishedArticles()
    const slugs = result.map(a => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    const article1 = result.find(a => a.slug === 'test-article-1')
    expect(article1?.publication_date).toBe('2026-06-18')
  })
})

describe('getArticleBySlug', () => {
  beforeEach(() => {
    resetDataCache()
    vi.stubGlobal('import.meta', { env: { DEV: true, BASE_URL: '/BriefBeakon/' } })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockArticles),
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the matching article', async () => {
    const result = await getArticleBySlug('test-article-2')
    expect(result).not.toBeNull()
    expect(result?.title).toBe('Test Article 2')
  })

  it('returns null for non-existent slug', async () => {
    const result = await getArticleBySlug('non-existent')
    expect(result).toBeNull()
  })
})

describe('getArticlesByCategory', () => {
  beforeEach(() => {
    resetDataCache()
    vi.stubGlobal('import.meta', { env: { DEV: true, BASE_URL: '/BriefBeakon/' } })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockArticles),
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('filters articles by category', async () => {
    const result = await getArticlesByCategory('technology')
    expect(result).toHaveLength(1)
    expect(result[0].category).toBe('technology')
  })

  it('returns empty array for category with no articles', async () => {
    const result = await getArticlesByCategory('general')
    expect(result).toEqual([])
  })
})

describe('getMovies', () => {
  beforeEach(() => {
    resetDataCache()
    vi.stubGlobal('import.meta', { env: { DEV: true, BASE_URL: '/BriefBeakon/' } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns movies from JSON fetch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockMovies),
    }))

    const result = await getMovies()
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Test Movie')
  })

  it('returns empty array on error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))
    const result = await getMovies()
    expect(result).toEqual([])
  })
})
