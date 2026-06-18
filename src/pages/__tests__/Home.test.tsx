import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home'
import type { Article, Category } from '../../types'
import * as data from '../../lib/data'

const T_CATEGORY = 'technology' as Category
const B_CATEGORY = 'business' as Category

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
    category: B_CATEGORY,
    author: 'AI',
    publication_date: '2026-06-17',
    word_count: 800,
    key_takeaways: ['Takeaway A'],
    tags: ['business'],
    meta_description: 'Meta 2',
    public_sentiment: 'Neutral',
    impact_analysis: 'Medium',
    future_outlook: 'Stable',
    keywords: ['business'],
    source_links: [],
    source_url: '',
    source_name: '',
    sentiment_score: 0.3,
  },
]

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
}

describe('Home', () => {
  beforeEach(() => {
    vi.stubGlobal('import.meta', { env: { DEV: true, BASE_URL: '/BriefBeakon/' } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading skeletons initially', () => {
    vi.spyOn(data, 'getPublishedArticles').mockReturnValue(new Promise(() => {}))
    renderHome()
    expect(document.querySelectorAll('.skeleton-pulse').length).toBeGreaterThan(0)
  })

  it('shows headline and beacon on load', async () => {
    vi.spyOn(data, 'getPublishedArticles').mockResolvedValue(mockArticles)
    renderHome()
    expect(await screen.findByText('BriefBeakon')).toBeInTheDocument()
    expect(screen.getByText("A Beacon for What Matters Today.")).toBeInTheDocument()
  })

  it('renders article cards when articles load', async () => {
    vi.spyOn(data, 'getPublishedArticles').mockResolvedValue(mockArticles)
    renderHome()
    expect(await screen.findByText('Test Article 1')).toBeInTheDocument()
    expect(screen.getByText('Test Article 2')).toBeInTheDocument()
  })

  it('shows stats after articles load', async () => {
    vi.spyOn(data, 'getPublishedArticles').mockResolvedValue(mockArticles)
    renderHome()
    expect(await screen.findByText('Categories')).toBeInTheDocument()
    expect(await screen.findByText('Articles Today')).toBeInTheDocument()
  })

  it('shows empty state when no articles', async () => {
    vi.spyOn(data, 'getPublishedArticles').mockResolvedValue([])
    renderHome()
    expect(await screen.findByText('No articles yet')).toBeInTheDocument()
  })

  it('renders CategoryNav', async () => {
    vi.spyOn(data, 'getPublishedArticles').mockResolvedValue(mockArticles)
    renderHome()
    expect(await screen.findByText('Categories')).toBeInTheDocument()
  })

  it('has a clickable scroll arrow', async () => {
    vi.spyOn(data, 'getPublishedArticles').mockResolvedValue(mockArticles)
    renderHome()
    const btn = await screen.findByLabelText('Scroll to articles')
    expect(btn).toBeInTheDocument()
    expect(btn.tagName).toBe('BUTTON')
  })
})
