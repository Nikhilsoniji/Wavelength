import { useEffect, useRef, useState } from 'react'
import {
  Minimize2,
  Maximize2,
  X,
  Tv,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import { youtubePlayer } from '../utils/youtubePlayer'

export default function VideoStreamPlayer() {
  const isVideoMode = usePlayerStore((s) => s.isVideoMode)
  const videoDisplayMode = usePlayerStore((s) => s.videoDisplayMode)
  const setVideoDisplayMode = usePlayerStore((s) => s.setVideoDisplayMode)
  const toggleVideoMode = usePlayerStore((s) => s.toggleVideoMode)
  const track = usePlayerStore((s) => s.currentTrack())
  const muted = usePlayerStore((s) => s.muted)
  const toggleMute = usePlayerStore((s) => s.toggleMute)

  const pipAnchorRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const hideTimerRef = useRef(null)

  // Measure anchor rect and sync with YouTube host container
  useEffect(() => {
    if (!isVideoMode) {
      youtubePlayer.setVideoMode('audio')
      return
    }

    if (videoDisplayMode === 'fullscreen') {
      youtubePlayer.setVideoMode('fullscreen')
      return
    }

    if (videoDisplayMode === 'pip' && pipAnchorRef.current) {
      const updateRect = () => {
        if (!pipAnchorRef.current) return
        const rect = pipAnchorRef.current.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          youtubePlayer.setVideoMode('pip', {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          })
        }
      }

      updateRect()
      window.addEventListener('resize', updateRect)
      window.addEventListener('scroll', updateRect, true)

      return () => {
        window.removeEventListener('resize', updateRect)
        window.removeEventListener('scroll', updateRect, true)
      }
    }
  }, [isVideoMode, videoDisplayMode, track?.id])

  // Auto-hide controls in fullscreen mode
  useEffect(() => {
    if (videoDisplayMode !== 'fullscreen') return

    const resetTimer = () => {
      setShowControls(true)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      hideTimerRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    resetTimer()
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('touchstart', resetTimer)

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('touchstart', resetTimer)
    }
  }, [videoDisplayMode])

  if (!isVideoMode || !track?.isYouTube) {
    return null
  }

  // Fullscreen video overlay controls
  if (videoDisplayMode === 'fullscreen') {
    return (
      <div className={`video-fullscreen-overlay ${showControls ? 'visible' : 'hidden'}`}>
        <div className="vfs-top-bar">
          <div className="vfs-track-info">
            <div className="vfs-badge">
              <span className="live-dot" />
              {track.isLive ? 'LIVE VIDEO STREAM' : 'NOW STREAMING HD'}
            </div>
            <h3 className="vfs-title">{track.title}</h3>
            <span className="vfs-artist">{track.artist}</span>
          </div>

          <div className="vfs-actions">
            <button
              className="vfs-btn"
              onClick={toggleMute}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              className="vfs-btn"
              onClick={() => setVideoDisplayMode('pip')}
              title="Return to Picture-in-Picture"
            >
              <Minimize2 size={20} />
            </button>
            <button
              className="vfs-btn vfs-close-btn"
              onClick={() => setVideoDisplayMode('audio')}
              title="Close Video (Keep Audio Playing)"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Picture-in-Picture floating docked player
  if (videoDisplayMode === 'pip') {
    return (
      <aside
        className="pip-stream-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Floating video player"
      >
        <div className={`pip-stream-header ${isHovered ? 'hovered' : ''}`}>
          <div className="pip-header-left">
            <Tv size={13} className="pip-icon text-cyan" />
            <span className="pip-title" title={track.title}>
              {track.title}
            </span>
          </div>

          <div className="pip-header-actions">
            <button
              className="pip-action-btn"
              onClick={() => setVideoDisplayMode('fullscreen')}
              title="Fullscreen Video"
              aria-label="Fullscreen Video"
            >
              <Maximize2 size={13} />
            </button>
            <button
              className="pip-action-btn pip-close-btn"
              onClick={() => setVideoDisplayMode('audio')}
              title="Close Video Mode (Audio Continues)"
              aria-label="Close Video Mode"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Video Placement Anchor */}
        <div ref={pipAnchorRef} className="pip-video-anchor" />

        {/* Bottom indicator badge */}
        <div className="pip-footer-badge">
          {track.isLive ? (
            <span className="pip-live-tag">
              <span className="live-dot" /> LIVE
            </span>
          ) : (
            <span className="pip-quality-tag">HD 1080P</span>
          )}
          <span className="pip-artist-name">{track.artist}</span>
        </div>
      </aside>
    )
  }

  return null
}
