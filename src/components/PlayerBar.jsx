import { useState, useRef, useEffect } from 'react'
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
  Tv,
  Music,
  Maximize2,
  Mic2,
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import { youtubePlayer } from '../utils/youtubePlayer'
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
  const isVideoMode = usePlayerStore((s) => s.isVideoMode)
  const videoDisplayMode = usePlayerStore((s) => s.videoDisplayMode)
  const setVideoDisplayMode = usePlayerStore((s) => s.setVideoDisplayMode)
  const setIsLyricsOpen = usePlayerStore((s) => s.setIsLyricsOpen)
  const [liked, setLiked] = useState(false)
  const videoSlotRef = useRef(null)

  // Measure slot and mount YouTube iframe into expanded view
  useEffect(() => {
    if (isVideoMode && track?.isYouTube && videoDisplayMode === 'embedded' && videoSlotRef.current) {
      const updateSlotRect = () => {
        if (!videoSlotRef.current) return
        const rect = videoSlotRef.current.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          youtubePlayer.setVideoMode('embedded', {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          })
        }
      }

      updateSlotRect()
      const timer = setTimeout(updateSlotRect, 60)
      window.addEventListener('resize', updateSlotRect)
      window.addEventListener('scroll', updateSlotRect, true)

      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', updateSlotRect)
        window.removeEventListener('scroll', updateSlotRect, true)
      }
    }
  }, [isVideoMode, videoDisplayMode, track?.id])

  if (!track) return null
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  const handleClose = () => {
    if (isVideoMode) {
      setVideoDisplayMode('pip')
    }
    onClose()
  }

  return (
    <div className="exp-overlay" onClick={handleClose}>
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
          <button className="exp-header-btn" onClick={handleClose} aria-label="Close player">
            <ChevronDown size={24} />
          </button>
          <div className="exp-header-info">
            <div className="exp-header-label">
              {isVideoMode && track.isYouTube ? 'VIDEO STREAM' : 'NOW PLAYING'}
            </div>
          </div>
          <button className="exp-header-btn" aria-label="More options">
            <MoreHorizontal size={22} />
          </button>
        </div>

        {/* Audio / Video Switcher Toggle */}
        {track.isYouTube && (
          <div className="exp-av-toggle-container">
            <div className="exp-av-toggle">
              <button
                className={`exp-av-pill ${!isVideoMode || videoDisplayMode === 'audio' ? 'active' : ''}`}
                onClick={() => setVideoDisplayMode('audio')}
              >
                <Music size={14} />
                <span>Audio Only</span>
              </button>
              <button
                className={`exp-av-pill ${isVideoMode && videoDisplayMode === 'embedded' ? 'active' : ''}`}
                onClick={() => setVideoDisplayMode('embedded')}
              >
                <Tv size={14} />
                <span>{track.isLive ? 'Live Stream' : 'Music Video'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Album Art / Video Slot */}
        <div className="exp-art-wrapper">
          {isVideoMode && track.isYouTube && videoDisplayMode === 'embedded' ? (
            <div className="exp-video-slot-wrapper">
              <div ref={videoSlotRef} className="exp-video-slot" />
              <div className="exp-video-overlay-bar">
                <span className="exp-video-badge">
                  {track.isLive ? '🔴 LIVE STREAM' : '🎬 1080P HD'}
                </span>
                <button
                  className="exp-video-expand-btn"
                  onClick={() => setVideoDisplayMode('fullscreen')}
                  title="Fullscreen Video"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <AlbumArt
              hue={track.hue || 280}
              thumbnail={track.thumbnail || track.cover}
              size={270}
              rounded={20}
              spinning={isPlaying}
            />
          )}
        </div>

        {/* Track info + Like */}
        <div className="exp-track-row">
          <div className="exp-track-info">
            <div className="exp-track-title">{track.title}</div>
            <div className="exp-track-artist">
              {track.isLive ? 'Live Stream' : `${track.artist} — ${track.album}`}
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
            <button
              className="exp-ctrl-btn exp-lyrics-btn"
              onClick={() => {
                onClose()
                setIsLyricsOpen(true)
              }}
              title="Real-time Synced Lyrics"
              aria-label="Real-time Synced Lyrics"
            >
              <Mic2 size={18} />
            </button>
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
  const isVideoMode = usePlayerStore((s) => s.isVideoMode)
  const toggleVideoMode = usePlayerStore((s) => s.toggleVideoMode)
  const setVideoDisplayMode = usePlayerStore((s) => s.setVideoDisplayMode)
  const isLyricsOpen = usePlayerStore((s) => s.isLyricsOpen)
  const toggleLyrics = usePlayerStore((s) => s.toggleLyrics)

  if (!track) return null
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleOpenExpanded = () => {
    if (isVideoMode) {
      setVideoDisplayMode('embedded')
    }
    setExpanded(true)
  }

  return (
    <>
      <div
        className="stitch-player-bar"
        onClick={handleOpenExpanded}
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
              {track.isVideoStream ? (
                <span className="spb-live-chip spb-video-stream-chip">📺 VIDEO STREAM</span>
              ) : track.isLive ? (
                <span className="spb-live-chip">LIVE</span>
              ) : null}
            </div>
            <div className="spb-artist">
              {track.isLive ? 'Live Stream' : `${track.artist}`}
            </div>
          </div>

          <div className="spb-controls" onClick={(e) => e.stopPropagation()}>
            <button
              className={`spb-btn spb-lyrics-btn ${isLyricsOpen ? 'lyrics-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleLyrics()
              }}
              title={isLyricsOpen ? 'Close Lyrics' : 'Live Synchronized Lyrics'}
              aria-label="Live Synchronized Lyrics"
            >
              <Mic2 size={18} />
              {isLyricsOpen && <span className="spb-lyrics-glow-dot" />}
            </button>

            {track.isYouTube && (
              <button
                className={`spb-btn spb-video-toggle-btn ${isVideoMode ? 'video-active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleVideoMode('pip')
                }}
                title={isVideoMode ? 'Hide Video (Audio Continues)' : 'Watch Video Stream (PiP)'}
                aria-label="Toggle Video Stream"
              >
                <Tv size={18} />
                {isVideoMode && <span className="spb-video-glow-dot" />}
              </button>
            )}

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

