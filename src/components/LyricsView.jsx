import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  X,
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Mic2,
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  Type,
  LocateFixed,
  Copy,
  Check,
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import { getTrackLyrics, getSynchronousLyrics } from '../data/lyrics'
import { getActiveLineIndex, formatLyricTime } from '../utils/lyricsParser'
import AlbumArt from './AlbumArt'

export default function LyricsView() {
  const isLyricsOpen = usePlayerStore((s) => s.isLyricsOpen)
  const setIsLyricsOpen = usePlayerStore((s) => s.setIsLyricsOpen)
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
  const seekTo = usePlayerStore((s) => s.seekTo)

  const [lyrics, setLyrics] = useState(() => (track ? getSynchronousLyrics(track) : []))
  const [isLoading, setIsLoading] = useState(false)
  const [fontSizeLevel, setFontSizeLevel] = useState('medium') // 'normal' | 'medium' | 'large'
  const [isUserScrolled, setIsUserScrolled] = useState(false)
  const [copiedLineId, setCopiedLineId] = useState(null)
  const [searchFilter, setSearchFilter] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const scrollContainerRef = useRef(null)
  const lineRefs = useRef(new Map())
  const userScrollTimeoutRef = useRef(null)
  const activeLineIndexRef = useRef(-1)

  // Fetch or load lyrics whenever current track changes
  useEffect(() => {
    if (!track) return

    // Immediately set synchronous lyrics for instantaneous render
    const sync = getSynchronousLyrics(track)
    setLyrics(sync)

    let isMounted = true
    setIsLoading(true)

    getTrackLyrics(track)
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setLyrics(data)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [track?.id])

  // Compute active line index using binary search O(log N)
  const activeIndex = useMemo(() => {
    return getActiveLineIndex(lyrics, currentTime)
  }, [lyrics, currentTime])

  activeLineIndexRef.current = activeIndex

  // Smooth Auto-scroll to center active line
  useEffect(() => {
    if (!isLyricsOpen || isUserScrolled || activeIndex < 0) return

    const lineElem = lineRefs.current.get(activeIndex)
    if (lineElem && scrollContainerRef.current) {
      lineElem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [activeIndex, isLyricsOpen, isUserScrolled])

  // Detect manual user scrolling
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return
    setIsUserScrolled(true)

    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current)
    }

    // Auto-resume auto-scroll after 4.5 seconds of user inactivity
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolled(false)
    }, 4500)
  }, [])

  // Manual re-center to active line
  const handleSnapToCurrent = () => {
    setIsUserScrolled(false)
    const lineElem = lineRefs.current.get(activeLineIndexRef.current)
    if (lineElem) {
      lineElem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  // Tap-to-seek handler with tactile feedback
  const handleLineClick = (time) => {
    if (typeof seekTo === 'function') {
      seekTo(time)
    }
    setIsUserScrolled(false)
  }

  // Copy lyric line
  const handleCopyLine = (e, text, id) => {
    e.stopPropagation()
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`"${text}" — ${track?.title} (${track?.artist})`)
      setCopiedLineId(id)
      setTimeout(() => setCopiedLineId(null), 2000)
    }
  }

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    if (!isLyricsOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLyricsOpen(false)
      } else if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLyricsOpen, setIsLyricsOpen, toggle])

  if (!isLyricsOpen || !track) return null

  const hue = track.hue || 280
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const filteredLyrics = searchFilter.trim()
    ? lyrics.filter((l) => l.text.toLowerCase().includes(searchFilter.toLowerCase().trim()))
    : lyrics

  return (
    <div
      className="lyrics-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Live Synchronized Lyrics"
    >
      {/* Dynamic Animated Ambient Background */}
      <div
        className="lyrics-ambient-bg"
        style={{
          background: `
            radial-gradient(circle at 20% 15%, hsl(${hue} 85% 25% / 0.55), transparent 60%),
            radial-gradient(circle at 80% 85%, hsl(${(hue + 45) % 360} 75% 20% / 0.5), transparent 65%),
            radial-gradient(circle at 50% 50%, hsl(${(hue + 180) % 360} 60% 12% / 0.35), transparent 70%),
            #08080a
          `,
        }}
      />
      <div className="lyrics-ambient-noise" />

      <div className="lyrics-container">
        {/* Top Header */}
        <header className="lyrics-header">
          <div className="lyrics-header-left">
            <div className="lyrics-header-art">
              <AlbumArt
                hue={hue}
                thumbnail={track.thumbnail || track.cover}
                size={48}
                rounded={12}
                spinning={isPlaying}
              />
            </div>
            <div className="lyrics-header-meta">
              <div className="lyrics-header-title-row">
                <span className="lyrics-header-title">{track.title}</span>
                <span className="lyrics-live-badge">
                  <span className="lyrics-live-dot" />
                  <Mic2 size={12} className="lyrics-live-icon" />
                  KARAOKE SYNC
                </span>
              </div>
              <div className="lyrics-header-artist">{track.artist}</div>
            </div>
          </div>

          <div className="lyrics-header-actions">
            {/* Search Filter Toggle */}
            <button
              className={`lyrics-icon-btn ${showSearch ? 'active' : ''}`}
              title="Search lyrics"
              onClick={() => {
                setShowSearch(!showSearch)
                if (showSearch) setSearchFilter('')
              }}
              aria-label="Search lyrics"
            >
              <Search size={18} />
            </button>

            {/* Font Size Adjuster */}
            <button
              className="lyrics-icon-btn"
              title="Cycle text size"
              onClick={() => {
                setFontSizeLevel((prev) =>
                  prev === 'normal' ? 'medium' : prev === 'medium' ? 'large' : 'normal'
                )
              }}
              aria-label="Adjust font size"
            >
              <Type size={18} />
            </button>

            {/* Close Button */}
            <button
              className="lyrics-close-btn"
              onClick={() => setIsLyricsOpen(false)}
              aria-label="Close lyrics"
              title="Close (Esc)"
            >
              <ChevronDown size={24} />
            </button>
          </div>
        </header>

        {/* Search Bar Input (Collapsible) */}
        {showSearch && (
          <div className="lyrics-search-banner">
            <Search size={16} className="lyrics-search-banner-icon" />
            <input
              type="text"
              className="lyrics-search-input"
              placeholder="Filter verses or lyrics..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              autoFocus
            />
            {searchFilter && (
              <button
                className="lyrics-search-clear"
                onClick={() => setSearchFilter('')}
                aria-label="Clear filter"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Lyrics Body & Lines */}
        <main
          className={`lyrics-body font-size-${fontSizeLevel}`}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <div className="lyrics-scroll-spacer top-spacer" />

          {filteredLyrics.length === 0 ? (
            <div className="lyrics-empty-state">
              <Sparkles size={36} className="lyrics-empty-icon" />
              <p className="lyrics-empty-title">
                {searchFilter ? 'No matching lines found' : 'Searching for lyrics...'}
              </p>
              <p className="lyrics-empty-desc">
                {searchFilter
                  ? 'Try searching with another word or phrase'
                  : 'Enjoy the rhythm and high-fidelity acoustics of Wavelength'}
              </p>
            </div>
          ) : (
            filteredLyrics.map((line, idx) => {
              const originalIndex = lyrics.indexOf(line)
              const isActive = originalIndex === activeIndex
              const isPast = originalIndex < activeIndex
              const isFuture = originalIndex > activeIndex

              return (
                <div
                  key={line.id || `line-${idx}`}
                  ref={(el) => {
                    if (el) lineRefs.current.set(originalIndex, el)
                    else lineRefs.current.delete(originalIndex)
                  }}
                  className={`lyric-line ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${
                    isFuture ? 'future' : ''
                  }`}
                  onClick={() => handleLineClick(line.time)}
                  style={{
                    '--line-accent': `hsl(${hue} 90% 65%)`,
                    '--line-glow': `hsl(${hue} 95% 55% / 0.4)`,
                  }}
                >
                  <div className="lyric-line-content">
                    <span className="lyric-text">{line.text}</span>

                    {/* Active Waveform Indicator */}
                    {isActive && isPlaying && (
                      <span className="lyric-active-wave" title="Singing now">
                        <span className="wave-bar b1" />
                        <span className="wave-bar b2" />
                        <span className="wave-bar b3" />
                      </span>
                    )}
                  </div>

                  <div className="lyric-hover-actions">
                    <span className="lyric-time-pill">{formatLyricTime(line.time)}</span>
                    <button
                      className="lyric-copy-btn"
                      title="Copy line"
                      onClick={(e) => handleCopyLine(e, line.text, line.id)}
                    >
                      {copiedLineId === line.id ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )
            })
          )}

          <div className="lyrics-scroll-spacer bottom-spacer" />
        </main>

        {/* Floating Re-sync / Snap Button (when user scrolled away) */}
        {isUserScrolled && activeIndex >= 0 && (
          <button
            className="lyrics-sync-pill"
            onClick={handleSnapToCurrent}
            aria-label="Snap to current lyric"
          >
            <LocateFixed size={16} />
            <span>Sync with playback</span>
          </button>
        )}

        {/* Persistent Bottom Controls */}
        <footer className="lyrics-footer">
          {/* Scrubber Progress Bar */}
          <div className="lyrics-scrubber">
            <span className="lyrics-time mono">{formatLyricTime(currentTime)}</span>
            <div
              className="lyrics-scrubber-track"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                if (typeof seekTo === 'function') seekTo(ratio * duration)
              }}
            >
              <div
                className="lyrics-scrubber-fill"
                style={{ width: `${progressPercent}%`, backgroundColor: `hsl(${hue} 90% 60%)` }}
              />
              <div
                className="lyrics-scrubber-thumb"
                style={{ left: `${progressPercent}%`, backgroundColor: `hsl(${hue} 90% 60%)` }}
              />
            </div>
            <span className="lyrics-time mono">{formatLyricTime(duration)}</span>
          </div>

          {/* Transport Controls */}
          <div className="lyrics-controls">
            <div className="lyrics-volume-wrap">
              <button
                className="lyrics-ctrl-icon-btn"
                onClick={toggleMute}
                aria-label="Toggle mute"
              >
                {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                className="lyrics-volume-slider"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume slider"
              />
            </div>

            <div className="lyrics-playback-buttons">
              <button
                className="lyrics-ctrl-btn lyrics-skip-btn"
                onClick={prev}
                aria-label="Previous track"
              >
                <SkipBack size={22} fill="currentColor" />
              </button>
              <button
                className="lyrics-play-btn"
                onClick={toggle}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                style={{
                  background: `linear-gradient(135deg, hsl(${hue} 90% 65%), hsl(${(hue + 35) % 360} 90% 55%))`,
                }}
              >
                {isPlaying ? <Pause size={24} fill="#050505" /> : <Play size={24} fill="#050505" />}
              </button>
              <button
                className="lyrics-ctrl-btn lyrics-skip-btn"
                onClick={next}
                aria-label="Next track"
              >
                <SkipForward size={22} fill="currentColor" />
              </button>
            </div>

            <div className="lyrics-hint-badge">
              <span>Tap any lyric to jump</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
