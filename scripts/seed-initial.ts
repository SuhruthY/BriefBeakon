import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = join(ROOT, 'public', 'data')
const PODCASTS_DIR = join(DATA_DIR, 'podcasts')

const MOVIES = [
  {
    id: 'oblivion-protocol', title: 'Oblivion Protocol', slug: 'oblivion-protocol', year: 2026,
    overall_sentiment: 'A visually spectacular sci-fi that asks big questions about memory and identity, even if its ambitions occasionally exceed its reach.',
    what_viewers_liked: ['Strong lead performance', 'Stunning visual effects', 'Innovative sound design', 'Tight pacing at 2h10m'],
    common_criticisms: ['Third act feels rushed', 'Supporting characters underdeveloped'],
    ai_verdict: 'A visually spectacular sci-fi that asks big questions about memory and identity, even if its ambitions occasionally exceed its reach.',
    watch_recommendation: 'Must-watch for sci-fi fans', critic_score: 78, audience_score: 72,
    publication_date: '2026-06-18', tags: ['oblivion-protocol', '2026', 'movie-review', 'sci-fi']
  },
  {
    id: 'the-last-monument', title: 'The Last Monument', slug: 'the-last-monument', year: 2026,
    overall_sentiment: 'A sweeping historical epic that educates while it entertains, anchored by performances that will be remembered come awards season.',
    what_viewers_liked: ['Powerful historical narrative', 'Outstanding ensemble cast', 'Beautiful period production design'],
    common_criticisms: ['Runtime of 2h45m feels long', 'Some historical liberties taken'],
    ai_verdict: 'A sweeping historical epic that educates while it entertains, anchored by performances that will be remembered come awards season.',
    watch_recommendation: 'Perfect for history enthusiasts', critic_score: 82, audience_score: 75,
    publication_date: '2026-06-18', tags: ['the-last-monument', '2026', 'movie-review', 'historical']
  },
  {
    id: 'neon-hearts', title: 'Neon Hearts', slug: 'neon-hearts', year: 2026,
    overall_sentiment: 'Style over substance, but what style it is. A visual feast that compensates for its narrative shortcomings with pure cinematic energy.',
    what_viewers_liked: ['Visually stunning cyberpunk aesthetic', 'Inventive action choreography', 'Strong female protagonist'],
    common_criticisms: ['Story follows predictable beats', 'Romantic subplot feels forced'],
    ai_verdict: 'Style over substance, but what style it is. A visual feast that compensates for its narrative shortcomings with pure cinematic energy.',
    watch_recommendation: 'Great for cyberpunk fans', critic_score: 71, audience_score: 68,
    publication_date: '2026-06-18', tags: ['neon-hearts', '2026', 'movie-review', 'cyberpunk']
  }
]

const PODCASTS = [
  {
    id: 'podcast-2026-06-18', title: 'BriefBeakon Daily - 2026-06-18', date: '2026-06-18',
    duration: 780, duration_display: '13:00',
    audio_url: '/BriefBeakon/data/podcasts/2026-06-18/audio.mp3', file_size: 5242880,
    transcript: '[Introduction] Welcome to BriefBeakon Daily. Today is Thursday, June 18, 2026.\n\n[AI News] Self-Driving Taxis Go Mainstream: Autonomous Fleet Launches in 12 Major Cities.\n\n[Technology News] TSMC Begins Mass Production of 1nm Chips, Ushering in New Era of Computing.\n\n[Business News] Global Markets Rally as Inflation Drops to 2% Target for First Time in Years.\n\n[Closing] Thats all for todays edition of BriefBeakon Daily. Stay informed, and well see you tomorrow.',
    segments: [
      { title: 'Introduction', text: 'Welcome to BriefBeakon Daily.', start_time: 0, end_time: 30 },
      { title: 'AI News', text: 'Self-Driving Taxis Go Mainstream.', start_time: 30, end_time: 180 },
      { title: 'Technology News', text: 'TSMC Begins Mass Production of 1nm Chips.', start_time: 180, end_time: 330 },
      { title: 'Business News', text: 'Global Markets Rally as Inflation Drops.', start_time: 330, end_time: 480 },
      { title: 'Closing', text: 'Thats all for today.', start_time: 480, end_time: 530 }
    ],
    story_count: 3, word_count: 1200, voice: 'en-US-JennyNeural'
  },
  {
    id: 'podcast-2026-06-17', title: 'BriefBeakon Daily - 2026-06-17', date: '2026-06-17',
    duration: 720, duration_display: '12:00',
    audio_url: '/BriefBeakon/data/podcasts/2026-06-17/audio.mp3', file_size: 4194304,
    transcript: '[Introduction] Welcome to BriefBeakon Daily. Today is Wednesday, June 17, 2026.\n\n[AI News] OpenAI Unveils GPT-5 with Breakthrough Reasoning Capabilities.\n\n[Technology News] Apple Vision Pro 2 Ships With Half the Weight and Double the Battery Life.\n\n[Closing] Thats all for todays edition of BriefBeakon Daily.',
    segments: [
      { title: 'Introduction', text: 'Welcome to BriefBeakon Daily.', start_time: 0, end_time: 25 },
      { title: 'AI News', text: 'OpenAI Unveils GPT-5.', start_time: 25, end_time: 175 },
      { title: 'Technology News', text: 'Apple Vision Pro 2 Ships.', start_time: 175, end_time: 325 },
      { title: 'Closing', text: 'Thats all for today.', start_time: 325, end_time: 375 }
    ],
    story_count: 2, word_count: 950, voice: 'en-US-GuyNeural'
  },
  {
    id: 'podcast-2026-06-16', title: 'BriefBeakon Daily - 2026-06-16', date: '2026-06-16',
    duration: 660, duration_display: '11:00',
    audio_url: '/BriefBeakon/data/podcasts/2026-06-16/audio.mp3', file_size: 3145728,
    transcript: '[Introduction] Welcome to BriefBeakon Daily. Today is Tuesday, June 16, 2026.\n\n[AI News] DeepMinds New AI Solves Decade-Old Biology Problem.\n\n[Business News] Nvidia Becomes First Trillion-Dollar Chip Company.\n\n[Closing] Thats all for todays edition of BriefBeakon Daily.',
    segments: [
      { title: 'Introduction', text: 'Welcome to BriefBeakon Daily.', start_time: 0, end_time: 25 },
      { title: 'AI News', text: 'DeepMind Solves Biology Problem.', start_time: 25, end_time: 175 },
      { title: 'Business News', text: 'Nvidia Becomes Trillion-Dollar Company.', start_time: 175, end_time: 325 },
      { title: 'Closing', text: 'Thats all for today.', start_time: 325, end_time: 375 }
    ],
    story_count: 2, word_count: 800, voice: 'en-US-JennyNeural'
  }
]

console.log('Seeding initial content...')

// Movies
writeFileSync(join(DATA_DIR, 'movies.json'), JSON.stringify(MOVIES, null, 2) + '\n')
console.log(`  Created ${MOVIES.length} movies in movies.json`)

// Podcasts
mkdirSync(PODCASTS_DIR, { recursive: true })
for (const ep of PODCASTS) {
  const dir = join(PODCASTS_DIR, ep.date)
  mkdirSync(dir, { recursive: true })
  const header = Buffer.from([0xFF, 0xFB, 0x90, 0x00, 0x00, 0x0F, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
  writeFileSync(join(dir, 'audio.mp3'), header)
  console.log(`  Created placeholder audio for ${ep.date}`)
}
writeFileSync(join(DATA_DIR, 'podcasts.json'), JSON.stringify(PODCASTS, null, 2) + '\n')
console.log(`  Created podcasts.json with ${PODCASTS.length} episodes`)

// RSS Feed
const rssItems = PODCASTS.map(ep => `  <item>
    <title>${ep.title}</title>
    <description>${ep.transcript}</description>
    <pubDate>${new Date(ep.date + 'T09:00:00+05:30').toUTCString()}</pubDate>
    <guid isPermaLink="false">${ep.id}</guid>
    <enclosure url="https://suhruash.github.io/BriefBeakon${ep.audio_url.replace('/BriefBeakon', '')}" length="${ep.file_size}" type="audio/mpeg"/>
    <itunes:duration>${ep.duration_display}</itunes:duration>
    <itunes:summary>${ep.story_count} stories from BriefBeakon Daily</itunes:summary>
  </item>`).join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>BriefBeakon Daily</title>
    <description>Your AI-curated daily news briefing. Every morning, a fresh 10-15 minute audio digest of the most important stories in AI, technology, business, sports, jobs, and entertainment.</description>
    <link>https://suhruash.github.io/BriefBeakon</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <itunes:author>BriefBeakon AI</itunes:author>
    <itunes:summary>A 10-15 minute daily audio briefing covering AI, technology, business, sports, jobs, and entertainment. New episodes generated every morning.</itunes:summary>
    <itunes:category text="News">
      <itunes:category text="Daily News"/>
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
${rssItems}
  </channel>
</rss>`

writeFileSync(join(ROOT, 'public', 'podcast.xml'), rss)
console.log('  Created podcast.xml RSS feed')
console.log('Done!')
