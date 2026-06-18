import { readFileSync, writeFileSync, mkdirSync, existsSync, createReadStream } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONFIG_PATH = join(ROOT, 'config', 'briefbeacon.json')
const ARTICLES_PATH = join(ROOT, 'public', 'data', 'articles.json')
const PODCASTS_DIR = join(ROOT, 'public', 'data', 'podcasts')
const PODCASTS_JSON = join(ROOT, 'public', 'data', 'podcasts.json')
const RSS_PATH = join(ROOT, 'public', 'podcast.xml')
const STATE_PATH = join(ROOT, 'content', 'state.json')

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
const podcastConfig = config.podcast

interface Article {
  slug: string; title: string; summary: string; category: string;
  publication_date: string; author: string; content: string;
  word_count: number; tags: string[];
}

interface PodcastSegment {
  title: string; text: string; start_time: number; end_time: number;
}

interface PodcastEpisode {
  id: string; title: string; date: string; duration: number;
  duration_display: string; audio_url: string; file_size: number;
  transcript: string; segments: PodcastSegment[];
  story_count: number; word_count: number; voice: string;
}

function pad(n: number): string { return n.toString().padStart(2, '0') }

function fmtDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${pad(s)}`
}

function pickVoice(date: Date): string {
  const day = date.getDate()
  return day % 2 === 0 ? podcastConfig.voices.female : podcastConfig.voices.male
}

function scriptForArticles(articles: Article[], voice: string): { segments: { title: string; text: string }[]; word_count: number } {
  const segments: { title: string; text: string }[] = []
  let word_count = 0

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const intro = `${podcastConfig.intro_text} Today is ${dateStr}.`
  segments.push({ title: 'Introduction', text: intro })
  word_count += intro.split(/\s+/).length

  const stories = articles.slice(0, podcastConfig.max_stories)
  for (const article of stories) {
    const text = `${article.title}. ${article.summary}`
    segments.push({ title: article.title, text })
    word_count += text.split(/\s+/).length
  }

  const outro = podcastConfig.outro_text
  segments.push({ title: 'Outro', text: outro })
  word_count += outro.split(/\s+/).length

  return { segments, word_count }
}

function getTodayArticles(): Article[] {
  if (!existsSync(ARTICLES_PATH)) return []
  const data = JSON.parse(readFileSync(ARTICLES_PATH, 'utf-8')) as Article[]
  const today = new Date().toISOString().split('T')[0]
  return data.filter(a => a.publication_date?.startsWith(today))
    .sort((a, b) => b.word_count - a.word_count)
}

function loadState(): Record<string, string> {
  if (!existsSync(STATE_PATH)) return {}
  return JSON.parse(readFileSync(STATE_PATH, 'utf-8'))
}

function saveState(state: Record<string, string>) {
  const dir = dirname(STATE_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2))
}

function hasEdgeTts(): boolean {
  try {
    execSync('edge-tts --help', { stdio: 'ignore' })
    return true
  } catch { return false }
}

function generateAudio(text: string, voice: string, outputPath: string): number {
  const dir = dirname(outputPath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  if (hasEdgeTts()) {
    try {
      execSync(
        `edge-tts --voice "${voice}" --text "${text.replace(/"/g, '\\"')}" --write-media "${outputPath}"`,
        { stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000 }
      )
      const stats = existsSync(outputPath) ? require('fs').statSync(outputPath) : null
      if (stats && stats.size > 100) return stats.size
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (!msg.includes('ETIMEDOUT') && !msg.includes('ECONNREFUSED')) {
        console.warn('edge-tts failed, generating placeholder:', msg)
      }
    }
  }

  const silencePath = outputPath.replace('.mp3', '_silence.mp3')
  try {
    execSync(
      `ffmpeg -y -f lavfi -i anullsrc=r=22050:cl=mono -t 10 -q:a 9 "${silencePath}" 2>NUL`,
      { stdio: 'ignore', timeout: 15000 }
    )
    if (existsSync(silencePath)) {
      const stats = require('fs').statSync(silencePath)
      if (stats.size > 100) {
        if (existsSync(outputPath)) require('fs').unlinkSync(outputPath)
        require('fs').renameSync(silencePath, outputPath)
        return stats.size
      }
    }
  } catch { /* no ffmpeg either */ }

  return 0
}

function concatenateAudio(inputs: string[], outputPath: string): boolean {
  if (inputs.length === 0) return false
  if (inputs.length === 1) {
    if (existsSync(inputs[0])) {
      const data = readFileSync(inputs[0])
      writeFileSync(outputPath, data)
      return true
    }
    return false
  }

  const dir = dirname(outputPath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  try {
    const listPath = join(dir, 'filelist.txt')
    writeFileSync(listPath, inputs.map(f => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'))
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${listPath}" -c copy "${outputPath}" 2>NUL`,
      { stdio: 'ignore', timeout: 30000 }
    )
    if (existsSync(listPath)) require('fs').unlinkSync(listPath)
    return existsSync(outputPath)
  } catch {
    if (inputs.length > 0 && existsSync(inputs[0])) {
      const data = readFileSync(inputs[0])
      writeFileSync(outputPath, data)
      return true
    }
    return false
  }
}

function estimateDuration(words: number): number {
  const wpm = 160
  return Math.ceil((words / wpm) * 60) + 5
}

function buildRss(episodes: PodcastEpisode[]): string {
  const siteUrl = config.site.url.replace(/\/+$/, '')
  const escaped = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  let items = ''
  for (const ep of episodes.slice(0, podcastConfig.max_episodes_in_feed)) {
    const audioUrl = `${escaped(siteUrl)}${ep.audio_url}`
    const date = new Date(ep.date).toUTCString()
    items += `  <item>
    <title>${escaped(ep.title)}</title>
    <pubDate>${date}</pubDate>
    <guid isPermaLink="false">${escaped(ep.id)}</guid>
    <description>${escaped(ep.transcript.slice(0, 300))}...</description>
    <enclosure url="${audioUrl}" length="${ep.file_size}" type="audio/mpeg" />
    <itunes:duration>${ep.duration}</itunes:duration>
  </item>`
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escaped(config.site.title)} Daily</title>
    <link>${escaped(siteUrl)}</link>
    <description>${escaped(config.site.description)}</description>
    <language>${config.site.language}</language>
    <itunes:author>BriefBeakon AI</itunes:author>
    <itunes:image href="${escaped(siteUrl)}/icons/podcast-artwork.png"/>
    <itunes:category text="News"/>
    <itunes:explicit>false</itunes:explicit>
${items}
  </channel>
</rss>`
}

export async function generatePodcast(forceDate?: string): Promise<PodcastEpisode | null> {
  const articles = getTodayArticles()
  if (articles.length === 0) {
    console.log('No articles for today — skipping podcast generation')
    return null
  }

  const now = forceDate ? new Date(forceDate + 'T12:00:00') : new Date()
  const dateStr = now.toISOString().split('T')[0]
  const voice = pickVoice(now)
  const { segments, word_count } = scriptForArticles(articles, voice)

  const epDir = join(PODCASTS_DIR, dateStr)
  if (!existsSync(epDir)) mkdirSync(epDir, { recursive: true })

  const audioPath = join(epDir, 'audio.mp3')
  const pkPath = join(PODCASTS_DIR, '..', 'podcasts.json')
  const existing: PodcastEpisode[] = existsSync(pkPath) ? JSON.parse(readFileSync(pkPath, 'utf-8')) : []

  const existingIdx = existing.findIndex(e => e.id === `podcast-${dateStr}`)
  if (existingIdx >= 0) {
    console.log(`Podcast for ${dateStr} already exists — skipping`)
    return existing[existingIdx]
  }

  console.log(`Generating podcast for ${dateStr} using voice: ${voice} (${segments.length} segments, ~${word_count} words)`)

  const tmpFiles: string[] = []
  let totalBytes = 0
  let currentTime = 0
  const timedSegments: PodcastSegment[] = []

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const segPath = join(epDir, `seg_${pad(i)}.mp3`)
    const segDuration = Math.max(3, Math.ceil(seg.text.split(/\s+/).length / 160 * 60))

    const fileSize = generateAudio(seg.text, voice, segPath)
    if (fileSize > 0) totalBytes += fileSize
    tmpFiles.push(segPath)

    timedSegments.push({
      title: seg.title,
      text: seg.text,
      start_time: currentTime,
      end_time: currentTime + segDuration,
    })
    currentTime += segDuration
  }

  console.log('Concatenating audio segments...')
  concatenateAudio(tmpFiles, audioPath)

  for (const f of tmpFiles) {
    try { if (existsSync(f) && f !== audioPath) require('fs').unlinkSync(f) } catch { /* ignore */ }
  }

  const totalDuration = estimateDuration(word_count)
  const transcript = segments.map(s => `[${s.title}]\n${s.text}`).join('\n\n')

  const episode: PodcastEpisode = {
    id: `podcast-${dateStr}`,
    title: `BriefBeakon Daily — ${dateStr}`,
    date: dateStr,
    duration: totalDuration,
    duration_display: fmtDuration(totalDuration),
    audio_url: `/BriefBeakon/data/podcasts/${dateStr}/audio.mp3`,
    file_size: totalBytes || 1,
    transcript,
    segments: timedSegments,
    story_count: articles.length,
    word_count,
    voice,
  }

  const state = loadState()
  state[`podcast-${dateStr}`] = dateStr
  saveState(state)

  const allPodcasts = [episode, ...existing]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, podcastConfig.max_episodes_in_feed)

  writeFileSync(PODCASTS_JSON, JSON.stringify(allPodcasts, null, 2))
  writeFileSync(RSS_PATH, buildRss(allPodcasts))

  console.log(`Podcast generated: ${audioPath} (${totalDuration}s, ${(totalBytes / 1024).toFixed(0)}KB)`)
  return episode
}

if (process.argv[1] && (process.argv[1].endsWith('generate-podcast.ts') || process.argv[1].endsWith('generate-podcast.js'))) {
  const forceDate = process.argv.find(a => a.startsWith('--date='))?.split('=')[1]
  generatePodcast(forceDate).catch(console.error)
}
