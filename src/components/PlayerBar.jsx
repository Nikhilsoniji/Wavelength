import { useState } from 'react'
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, Volume1, VolumeX, Download,
  Heart, Shuffle, Repeat, Repeat1,
  ChevronDown, MoreHorizontal, ListMusic,
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import AlbumArt from './AlbumArt'
import WaveformSeek from './WaveformSeek'

function fmt(s) {
  if (!s || !Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sc = Math.floor(s % 60)
  return `${m}:${String(sc).padStart(2, '0')}`
}

/* ── Expanded Full-Screen Player ─────────────────────────────── */
function ExpandedPlayer({ onClose, seekTo }) {
  const track       = usePlayerStore((s) => s.currentTrack())
  const isPlaying   = usePlayerStore((s) => s.isPlaying)
  const toggle      = usePlayerStore((s) => s.toggle)
  const next        = usePlayerStore((s) => s.next)
  const prev        = usePlayerStore((s) => s.prev)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration    = usePlayerStore((s) => s.duration)
  const volume      = usePlayerStore((s) => s.volume)
  const muted       = usePlayerStore((s) => s.muted)
  const setVolume   = usePlayerStore((s) => s.setVolume)
  const toggleMute  = usePlayerStore((s) => s.toggleMute)
  const shuffle     = usePlayerStore((s) => s.shuffle)
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle)
  const repeat      = usePlayerStore((s) => s.repeat)
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat)
  const [liked, setLiked] = useState(false)

  if (!track) return null
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="exp-overlay" onClick={onClose}>
      <div className="exp-panel" onClick={(e) => e.stopPropagation()}>
        {/* Background blur art */}
        <div
          className="exp-bg-art"
          style={{
            background: `radial-gradient(ellipse at 30% 0%, hsl(${track.hue} 80% 30% / 0.6), transparent 60%),
                         radial-gradient(ellipse at 80% 100%, hsl(${(track.hue + 60) % 360} 70% 20% / 0.5), transparent 60%),
                         #09090B`,
          }}
        />

        {/* Header */}
        <div className="exp-header">
          <button className="exp-header-btn" onClick={onClose} aria-label="Close player">
            <ChevronDown size={24} />
          </button>
          <div className="exp-header-info">
            <div className="exp-header-label">NOW PLAYING</div>
          </div>
          <button className="exp-header-btn" aria-label="More options">
            <MoreHorizontal size={22} />
          </button>
        </div>

        {/* Album Art — large */}
        <div className="exp-art-wrapper">
          <div className="exp-art-glow" style={{ background: `hsl(${track.hue} 80% 50% / 0.3)` }} />
          <AlbumArt hue={track.hue} size={260} rounded={24} spinning={isPlaying} />
        </div>

        {/* Track info + like */}
        <div className="exp-track-row">
          <div className="exp-track-info">
            <div className="exp-track-title">{track.title}</div>
            <div className="exp-track-artist">
              {track.isLive ? '🔴 Live Stream' : `${track.artist} • ${track.album}`}
            </div>
          </div>
          <button
            className={`exp-like-btn${liked ? ' liked' : ''}`}
            onClick={() => setLiked(!liked)}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart size={22} fill={liked ? '#ff4d88' : 'none'} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="exp-progress-wrap">
          <WaveformSeek
            trackId={track.id}
            currentTime={currentTime}
            duration={duration}
            isLive={track.isLive}
            onSeek={seekTo}
          />
          <div className="exp-times">
            <span>{fmt(currentTime)}</span>
            <span>{track.isLive ? 'LIVE' : fmt(duration)}</span>
          </div>
        </div>

        {/* Main transport controls */}
        <div className="exp-controls">
          <button
            className={`exp-ctrl-btn${shuffle ? ' active' : ''}`}
            onClick={toggleShuffle}
            aria-label="Shuffle"
          >
            <Shuffle size={20} />
          </button>

          <button className="exp-ctrl-btn exp-ctrl-skip" onClick={prev} aria-label="Previous">
            <SkipBack size={26} fill="currentColor" />
          </button>

          <button className="exp-play-btn" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
            <div className="exp-play-ring" />
            {isPlaying
              ? <Pause size={28} fill="#1a0062" />
              : <Play size={28} fill="#1a0062" />
            }
          </button>

          <button className="exp-ctrl-btn exp-ctrl-skip" onClick={next} aria-label="Next">
            <SkipForward size={26} fill="currentColor" />
          </button>

          <button
            className={`exp-ctrl-btn${repeat !== 'off' ? ' active' : ''}`}
            onClick={cycleRepeat}
            aria-label="Repeat"
          >
            {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        {/* Volume + extras */}
        <div className="exp-bottom-row">
          <button className="exp-ctrl-btn" onClick={toggleMute}>
            <VolumeIcon size={18} />
          </button>
          <input
            className="exp-volume-slider"
            type="range" min={0} max={1} step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
          <div className="exp-extras">
            {track.src && (
              <a
                className="exp-ctrl-btn"
                href={track.src}
                download={track.title || 'track'}
                title="Download"
              >
                <Download size={18} />
              </a>
            )}
            <button className="exp-ctrl-btn" aria-label="Queue">
              <ListMusic size={18} />
            </button>
          </div>
        </div>

        {/* 24-bit badge */}
        <div className="exp-hifi-badge">
          <span className="exp-hifi-dot" />
          24-BIT LOSSLESS
        </div>
      </div>
    </div>
  )
}

/* ── Mini Player Bar ─────────────────────────────────────────── */
export default function PlayerBar({ seekTo }) {
  const [expanded, setExpanded] = useState(false)
  const track      = usePlayerStore((s) => s.currentTrack())
  const isPlaying  = usePlayerStore((s) => s.isPlaying)
  const toggle     = usePlayerStore((s) => s.toggle)
  const next       = usePlayerStore((s) => s.next)
  const prev       = usePlayerStore((s) => s.prev)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration   = usePlayerStore((s) => s.duration)

  if (!track) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      {/* Mini bar */}
      <div className="stitch-player-bar" onClick={() => setExpanded(true)} style={{ cursor: 'pointer' }}>
        <div className="spb-inner glass-card">
          {/* Progress fill at top of bar */}
          <div className="spb-progress-fill" style={{ width: `${progress}%` }} />

          {/* Album art */}
          <div className="spb-art" onClick={(e) => e.stopPropagation()}>
            <AlbumArt hue={track.hue} size={44} rounded={10} spinning={isPlaying} />
          </div>

          {/* Track info */}
          <div className="spb-meta">
            <div className="spb-title">{track.title}</div>
            <div className="spb-artist">
              {track.isLive ? 'Live Stream' : `${track.artist} • ${track.album}`}
            </div>
          </div>

          {/* Controls — stop propagation so only bar click opens expanded */}
          <div className="spb-controls" onClick={(e) => e.stopPropagation()}>
            <button className="spb-btn" aria-label="Previous" onClick={prev}>
              <SkipBack size={18} />
            </button>
            <button className="spb-play-btn" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={toggle}>
              {isPlaying
                ? <Pause size={20} fill="#1a0062" />
                : <Play size={20} fill="#1a0062" />
              }
            </button>
            <button className="spb-btn" aria-label="Next" onClick={next}>
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded full-screen player */}
      {expanded && <ExpandedPlayer onClose={() => setExpanded(false)} seekTo={seekTo} />}
    </>
  )
}
