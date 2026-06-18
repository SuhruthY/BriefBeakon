import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getPodcasts, resetDataCache } from '../lib/data'
import type { PodcastEpisode, PodcastSegment } from '../types'

const mockPodcasts: PodcastEpisode[] = [
  {
    id: 'podcast-2026-06-18',
    title: 'BriefBeakon Daily — 2026-06-18',
    date: '2026-06-18',
    duration: 780,
    duration_display: '13:00',
    audio_url: '/BriefBeakon/data/podcasts/2026-06-18/audio.mp3',
    file_size: 5242880,
    transcript: '[Introduction]\nWelcome to...\n\n[AI News]\nOpenAI unleashed...',
    segments: [
      { title: 'Introduction', text: 'Welcome to BriefBeakon Daily', start_time: 0, end_time: 30 },
      { title: 'AI News', text: 'OpenAI unleashed GPT-5', start_time: 30, end_time: 180 },
    ],
    story_count: 2,
    word_count: 1500,
    voice: 'en-US-GuyNeural',
  },
  {
    id: 'podcast-2026-06-17',
    title: 'BriefBeakon Daily — 2026-06-17',
    date: '2026-06-17',
    duration: 720,
    duration_display: '12:00',
    audio_url: '/BriefBeakon/data/podcasts/2026-06-17/audio.mp3',
    file_size: 4194304,
    transcript: '[Introduction]\nYesterday news...',
    segments: [
      { title: 'Introduction', text: 'Yesterday news', start_time: 0, end_time: 25 },
    ],
    story_count: 3,
    word_count: 1200,
    voice: 'en-US-JennyNeural',
  },
]

describe('PodcastEpisode type', () => {
  it('has all required fields', () => {
    const ep: PodcastEpisode = mockPodcasts[0]
    expect(ep.id).toBeDefined()
    expect(ep.title).toBeDefined()
    expect(ep.date).toBeDefined()
    expect(ep.duration).toBeGreaterThan(0)
    expect(ep.duration_display).toBeDefined()
    expect(ep.audio_url).toBeDefined()
    expect(ep.file_size).toBeGreaterThan(0)
    expect(ep.transcript).toBeDefined()
    expect(Array.isArray(ep.segments)).toBe(true)
    expect(ep.story_count).toBeGreaterThan(0)
    expect(ep.word_count).toBeGreaterThan(0)
    expect(ep.voice).toBeDefined()
  })

  it('segments have correct structure', () => {
    const seg: PodcastSegment = mockPodcasts[0].segments[0]
    expect(seg.title).toBeDefined()
    expect(seg.text).toBeDefined()
    expect(typeof seg.start_time).toBe('number')
    expect(typeof seg.end_time).toBe('number')
    expect(seg.end_time).toBeGreaterThan(seg.start_time)
  })
})

describe('PodcastSegment', () => {
  it('start_time is non-negative', () => {
    for (const ep of mockPodcasts) {
      for (const seg of ep.segments) {
        expect(seg.start_time).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('segments do not overlap', () => {
    for (const ep of mockPodcasts) {
      for (let i = 1; i < ep.segments.length; i++) {
        expect(ep.segments[i].start_time).toBeGreaterThanOrEqual(ep.segments[i - 1].end_time)
      }
    }
  })

  it('final segment end_time <= duration', () => {
    for (const ep of mockPodcasts) {
      if (ep.segments.length > 0) {
        const last = ep.segments[ep.segments.length - 1]
        expect(last.end_time).toBeLessThanOrEqual(ep.duration)
      }
    }
  })
})

describe('getPodcasts', () => {
  beforeEach(() => {
    resetDataCache()
    vi.stubGlobal('import.meta', { env: { DEV: true, BASE_URL: '/BriefBeakon/' } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns episodes from JSON fetch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPodcasts),
    }))

    const result = await getPodcasts()
    expect(result).toHaveLength(2)
    expect(result[0].title).toContain('2026-06-18')
    expect(result[1].title).toContain('2026-06-17')
  })

  it('returns empty array on fetch error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))
    const result = await getPodcasts()
    expect(result).toEqual([])
  })

  it('returns empty array on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await getPodcasts()
    expect(result).toEqual([])
  })

  it('caches result on second call', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPodcasts),
    })
    vi.stubGlobal('fetch', mockFetch)

    await getPodcasts()
    await getPodcasts()
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})

describe('podcast data sorting', () => {
  it('episodes are sorted newest first', () => {
    const sorted = [...mockPodcasts].sort((a, b) => b.date.localeCompare(a.date))
    expect(sorted[0].date).toBe('2026-06-18')
    expect(sorted[1].date).toBe('2026-06-17')
  })
})

describe('PodcastPage component', () => {
  beforeEach(() => {
    resetDataCache()
    vi.stubGlobal('import.meta', { env: { DEV: true, BASE_URL: '/BriefBeakon/' } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders loading skeleton initially', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))
    const { default: PodcastPage } = await import('../pages/PodcastPage')
    const { container } = render(<MemoryRouter><PodcastPage /></MemoryRouter>)
    expect(container.querySelectorAll('.skeleton-pulse').length).toBeGreaterThan(0)
  })

  it('renders empty state when no episodes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) }))
    const { default: PodcastPage } = await import('../pages/PodcastPage')
    render(<MemoryRouter><PodcastPage /></MemoryRouter>)
    expect(await screen.findByText('No episodes yet')).toBeInTheDocument()
  })

  it('renders episodes when data loads', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockPodcasts) }))
    const { default: PodcastPage } = await import('../pages/PodcastPage')
    render(<MemoryRouter><PodcastPage /></MemoryRouter>)
    await waitFor(() => expect(screen.getAllByText('BriefBeakon Daily — 2026-06-18').length).toBeGreaterThanOrEqual(1))
    expect(screen.getByText('BriefBeakon Daily — 2026-06-17')).toBeInTheDocument()
  })

  it('shows subscribe section with RSS link', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockPodcasts) }))
    const { default: PodcastPage } = await import('../pages/PodcastPage')
    render(<MemoryRouter><PodcastPage /></MemoryRouter>)
    expect(await screen.findByText('Subscribe')).toBeInTheDocument()
    expect(screen.getByText(/podcast\.xml/)).toBeInTheDocument()
  })

  it('shows headline and tagline', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockPodcasts) }))
    const { default: PodcastPage } = await import('../pages/PodcastPage')
    render(<MemoryRouter><PodcastPage /></MemoryRouter>)
    expect(await screen.findByText('BriefBeakon Daily')).toBeInTheDocument()
    expect(screen.getByText(/AI-curated daily news/)).toBeInTheDocument()
  })
})
