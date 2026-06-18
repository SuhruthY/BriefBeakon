import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause, Download, Headphones, Clock, FileText } from 'lucide-react'
import type { PodcastEpisode } from '../types'

export default function PodcastPlayer({ episode }: { episode: PodcastEpisode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeSegment, setActiveSegment] = useState(-1)
  const [hasError, setHasError] = useState(false)

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => setHasError(true))
    }
  }, [playing])

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return
    const t = audioRef.current.currentTime
    setCurrentTime(t)
    const idx = episode.segments.findIndex(s => t >= s.start_time && t < s.end_time)
    if (idx >= 0) setActiveSegment(idx)
  }, [episode.segments])

  const segmentClicked = useCallback((idx: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = episode.segments[idx].start_time
    if (!playing) {
      audioRef.current.play().catch(() => setHasError(true))
      setPlaying(true)
    }
  }, [episode.segments, playing])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnd = () => setPlaying(false)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => setHasError(true)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const progress = episode.duration > 0 ? (currentTime / episode.duration) * 100 : 0

  return (
    <div className="glass rounded-xl p-5 sm:p-6 mb-6">
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} preload="metadata">
        <source src={episode.audio_url} type="audio/mpeg" />
      </audio>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">{episode.title}</h2>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {episode.duration_display}</span>
            <span className="flex items-center gap-1"><Headphones className="w-3 h-3" /> {episode.story_count} stories</span>
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {episode.word_count} words</span>
          </div>
        </div>
        <a
          href={episode.audio_url}
          download
          className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/50 transition-all"
          aria-label="Download MP3"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>

      {hasError && (
        <div className="text-xs text-amber-400 mb-3 p-2 rounded-lg bg-amber-950/30 border border-amber-900/30">
          Audio failed to load. The file may not be available yet — check back after the next generation run.
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-colors shrink-0"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
        </button>

        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <span className="text-xs text-slate-500 tabular-nums shrink-0">
          {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {episode.duration_display}
        </span>
      </div>

      <details className="group">
        <summary className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors select-none">
          Transcript ({episode.segments.length} segments)
        </summary>
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {episode.segments.map((seg, i) => (
            <button
              key={i}
              onClick={() => segmentClicked(i)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-all ${
                activeSegment === i
                  ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-200'
                  : 'bg-slate-800/30 border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
              }`}
            >
              <span className="font-semibold text-white block mb-0.5">{seg.title}</span>
              <span className="line-clamp-3">{seg.text}</span>
              <span className="text-[10px] text-slate-600 mt-1 block">
                {Math.floor(seg.start_time / 60)}:{String(Math.floor(seg.start_time % 60)).padStart(2, '0')} – {Math.floor(seg.end_time / 60)}:{String(Math.floor(seg.end_time % 60)).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>
      </details>
    </div>
  )
}
