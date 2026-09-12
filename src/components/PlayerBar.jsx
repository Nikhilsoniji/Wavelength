import { useState } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Download,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  ChevronDown,
  MoreHorizontal,
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

/* Expanded Full-Screen Player */
function ExpandedPlayer({ onClose, seekTo }) {
  const track = usePlayerStore((s) => s.currentTrack())
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const toggle = usePlayerStore((s) => s.toggle)
  const next = usePlayerStore((s) => s.next)
  const prev = usePlayerStore((s) => s.prev)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)
  const volume = usePlayerStore((s) => s.volume)
  const muted = usePlayerStore((s) => s.muted)
  const setVolume = usePlayerStore((s) => s.setVolume)
  const toggleMute = usePlayerStore((s) => s.toggleMute)
  const shuffle = usePlayerStore((s) => s.shuffle)
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle)
  const repeat = usePlayerStore((s) => s.repeat)
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat)
  const [liked, setLiked] = useState(false)

  if (!track) return null
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div className="exp-overlay" onClick={onClose}>
      <div className="exp-panel" onClick={(e) => e.stopPropagation()}>
        {/* Ambient background */}
        <div
          className="exp-bg-art"
          style={{
            background: `radial-gradient(ellipse at 30% 0%, hsl(${track.hue || 280} 60% 30% / 0.5), transparent 60%),
                         radial-gradient(ellipse at 80% 100%, hsl(${((track.hue || 280) + 60) % 360} 50% 20% / 0.4), transparent 60%),
                         var(--bg-secondary)`,
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

        {/* Album Art */}
        <div className="exp-art-wrapper">
          <AlbumArt
            hue={track.hue || 280}
            thumbnail={track.thumbnail || track.cover}
            size={270}
            rounded={20}
            spinning={isPlaying}
          />
        </div>

        {/* Track info + Like */}
        <div className="exp-track-row">
          <div className="exp-track-info">
            <div className="exp-track-title">{track.title}</div>
            <div className="exp-track-artist">
              {track.isLive ? 'Live Radio' : `${track.artist} — ${track.album}`}
            </div>
          </div>
          <button
            className={`exp-like-btn ${liked ? 'liked' : ''}`}
            onClick={() => setLiked(!liked)}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart size={24} fill={liked ? 'var(--accent)' : 'none'} color={liked ? 'var(--accent)' : 'currentColor'} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="exp-progress-wrap">
          <WaveformSeek
            trackId={track.id}
            currentTime={currentTime}
            duration={duration}
            isLive={track.isLive}
            onSeek={seekTo}
          />
          <div className="exp-times">
            <span className="time-mono">{fmt(currentTime)}</span>
            <span className="time-mono">{track.isLive ? 'LIVE' : fmt(duration)}</span>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="exp-controls">
          <button
            className={`exp-ctrl-btn ${shuffle ? 'active' : ''}`}
            onClick={toggleShuffle}
            aria-label="Shuffle"
          >
            <Shuffle size={20} />
          </button>

          <button className="exp-ctrl-btn exp-ctrl-skip" onClick={prev} aria-label="Previous">
            <SkipBack size={26} fill="currentColor" />
          </button>

          <button
            className="exp-play-btn"
            onClick={toggle}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={28} fill="#0a0a0a" />
            ) : (
              <Play size={28} fill="#0a0a0a" />
            )}
          </button>

          <button className="exp-ctrl-btn exp-ctrl-skip" onClick={next} aria-label="Next">
            <SkipForward size={26} fill="currentColor" />
          </button>

          <button
            className={`exp-ctrl-btn ${repeat !== 'off' ? 'active' : ''}`}
            onClick={cycleRepeat}
            aria-label="Repeat"
          >
            {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        {/* Volume */}
        <div className="exp-bottom-row">
          <button className="exp-ctrl-btn" onClick={toggleMute} aria-label="Mute toggle">
            <VolumeIcon size={18} />
          </button>
          <input
            className="exp-volume-slider"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
          <div className="exp-extras">
            {track.src && !track.isYouTube && (
              <a
                className="exp-ctrl-btn"
                href={track.src}
                download={track.title || 'track'}
                title="Download"
              >
                <Download size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* Mini Player Bar */
export default function PlayerBar({ seekTo }) {
  const [expanded, setExpanded] = useState(false)
  const track = usePlayerStore((s) => s.currentTrack())
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const toggle = usePlayerStore((s) => s.toggle)
  const next = usePlayerStore((s) => s.next)
  const prev = usePlayerStore((s) => s.prev)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)

  if (!track) return null
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <>
      <div
        className="stitch-player-bar"
        onClick={() => setExpanded(true)}
        style={{ cursor: 'pointer' }}
      >
        <div className="spb-inner">
          <div className="spb-progress-fill" style={{ width: `${progress}%` }} />

          <div className="spb-art" onClick={(e) => e.stopPropagation()}>
            <AlbumArt
              hue={track.hue || 280}
              thumbnail={track.thumbnail || track.cover}
              size={46}
              rounded={10}
              spinning={isPlaying}
            />
          </div>

          <div className="spb-meta">
            <div className="spb-title-row">
              <span className="spb-title">{track.title}</span>
              {track.isLive && <span className="spb-live-chip">LIVE</span>}
            </div>
            <div className="spb-artist">
              {track.isLive ? 'Live Radio' : `${track.artist}`}
            </div>
          </div>

          <div className="spb-controls" onClick={(e) => e.stopPropagation()}>
            <button className="spb-btn" aria-label="Previous" onClick={prev}>
              <SkipBack size={18} />
            </button>
            <button
              className="spb-play-btn"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={toggle}
            >
              {isPlaying ? (
                <Pause size={20} fill="#0a0a0a" />
              ) : (
                <Play size={20} fill="#0a0a0a" />
              )}
            </button>
            <button className="spb-btn" aria-label="Next" onClick={next}>
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      </div>

      {expanded && <ExpandedPlayer onClose={() => setExpanded(false)} seekTo={seekTo} />}
    </>
  )
}
