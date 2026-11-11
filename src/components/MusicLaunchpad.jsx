import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Rocket,
  Sparkles,
  Flame,
  Zap,
  Play,
  Pause,
  Disc3,
  Clock,
  Share2,
  Heart,
  TrendingUp,
  Tv,
  Check,
  Mic2,
  Music,
  Headphones,
  Radio,
  Sliders,
  Volume2
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import { playSoundEffect } from '../utils/soundFX'
import { haptics } from '../utils/haptics'
import AlbumArt from './AlbumArt'

const SOUND_PADS = [
  { id: 'kick', key: '1', label: '808 Kick', sub: 'Sub Punch', icon: '💥', color: '#ef4444' },
  { id: 'snare', key: '2', label: 'Trap Snare', sub: 'Crisp Clap', icon: '🥁', color: '#f59e0b' },
  { id: 'hihat', key: '3', label: 'Hi-Hat Roll', sub: '16th Groove', icon: '✨', color: '#10b981' },
  { id: 'siren', key: '4', label: 'EDM Siren', sub: 'Drop Riser', icon: '⚡', color: '#06b6d4' },
  { id: 'airhorn', key: '5', label: 'Airhorn', sub: 'Stadium Horn', icon: '🌪️', color: '#8b5cf6' },
  { id: 'bassdrop', key: '6', label: 'Sub Downlifter', sub: 'Sub 30Hz', icon: '🔊', color: '#ec4899' },
  { id: 'cosmic', key: '7', label: 'Cosmic Chime', sub: 'Arp Synth', icon: '🛸', color: '#6366f1' },
  { id: 'glitch', key: '8', label: 'Glitch Drop', sub: 'Cyber Down', icon: '💣', color: '#14b8a6' },
]

export default function MusicLaunchpad({ onBack }) {
  const library = usePlayerStore((s) => s.library)
  const currentId = usePlayerStore((s) => s.currentId)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)
  const setIsLyricsOpen = usePlayerStore((s) => s.setIsLyricsOpen)
  const toggleVideoMode = usePlayerStore((s) => s.toggleVideoMode)
  const setQueue = usePlayerStore((s) => s.setQueue)

  const [activeFilter, setActiveFilter] = useState('all')
  const [hypeCount, setHypeCount] = useState(1482)
  const [isHyped, setIsHyped] = useState(false)
  const [activePad, setActivePad] = useState(null)
  const [copiedShare, setCopiedShare] = useState(false)

  // Countdown timer for next drop
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 28, seconds: 45 })

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Featured Premiere Drop
  const heroPremiereTrack = useMemo(() => {
    return (
      library.find((t) => t.id === 'bw-1') || // Tauba Tauba
      library.find((t) => t.id === 'hw-1') || // Die With A Smile
      library[0]
    )
  }, [library])

  const isHeroPlaying = isPlaying && currentId === heroPremiereTrack?.id

  // Filtered drops
  const launchDrops = useMemo(() => {
    if (activeFilter === 'bollywood') {
      return library.filter((t) => t.category === 'Bollywood')
    }
    if (activeFilter === 'hollywood') {
      return library.filter((t) => t.category === 'Hollywood')
    }
    if (activeFilter === 'edm') {
      return library.filter((t) => t.genre?.includes('EDM') || t.genre?.includes('Party') || t.genre?.includes('Synthwave'))
    }
    if (activeFilter === 'video') {
      return library.filter((t) => t.isVideoStream)
    }
    return library.slice(0, 16)
  }, [library, activeFilter])

  // Sound FX trigger
  const triggerPad = useCallback((padId) => {
    haptics.impact()
    playSoundEffect(padId)
    setActivePad(padId)
    setTimeout(() => {
      setActivePad((curr) => (curr === padId ? null : curr))
    }, 180)
  }, [])

  // Keybinding listener for pads 1-8
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return
      const pad = SOUND_PADS.find((p) => p.key === e.key)
      if (pad) {
        e.preventDefault()
        triggerPad(pad.id)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [triggerPad])

  // Launch track action: queues and plays immediately with haptics
  const handleLaunchTrack = (track) => {
    haptics.impact()
    if (currentId === track.id) {
      toggle()
      return
    }
    // Set queue to all current drops starting from this track
    const dropIds = launchDrops.map((d) => d.id)
    if (dropIds.includes(track.id)) {
      setQueue(dropIds)
    }
    play(track.id)
  }

  const handleHypeClick = () => {
    haptics.impact()
    if (!isHyped) {
      setHypeCount((c) => c + 1)
      setIsHyped(true)
    } else {
      setHypeCount((c) => c - 1)
      setIsHyped(false)
    }
  }

  const handleShare = () => {
    haptics.impact()
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedShare(true)
        setTimeout(() => setCopiedShare(false), 2000)
      })
    }
  }

  return (
    <div className="music-launchpad-page">
      {/* Launchpad Top Banner */}
      <div className="launchpad-header">
        <div className="launchpad-header-left">
          <div className="launchpad-pill-tag">
            <Rocket size={14} className="launch-rocket-icon" />
            <span>WAVELENGTH LAUNCHPAD</span>
            <span className="launch-pulse-dot" />
          </div>
          <h1 className="launchpad-title">New Music Launch Radar</h1>
          <p className="launchpad-subtitle">
            World premieres, chart drops & exclusive lossless premieres with live DJ beat launchpad.
          </p>
        </div>

        <div className="launchpad-countdown-card">
          <div className="countdown-label">
            <Clock size={13} />
            <span>NEXT EXCLUSIVE DROP IN</span>
          </div>
          <div className="countdown-digits">
            <div className="countdown-unit">
              <span className="unit-number">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="unit-label">HRS</span>
            </div>
            <span className="countdown-colon">:</span>
            <div className="countdown-unit">
              <span className="unit-number">{String(countdown.minutes).padStart(2, '0')}</span>
              <span className="unit-label">MIN</span>
            </div>
            <span className="countdown-colon">:</span>
            <div className="countdown-unit">
              <span className="unit-number">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="unit-label">SEC</span>
            </div>
          </div>
          <div className="countdown-target">Global Premiere • Neon Horizon EP</div>
        </div>
      </div>

      {/* Hero Premiere Spotlight Card */}
      {heroPremiereTrack && (
        <section className="launch-hero-card">
          <div
            className="launch-hero-bg"
            style={{
              background: `radial-gradient(circle at 75% 30%, hsl(${heroPremiereTrack.hue || 280} 85% 35% / 0.4), transparent 70%),
                          linear-gradient(135deg, rgba(16, 12, 28, 0.95) 0%, rgba(30, 15, 50, 0.9) 100%)`,
            }}
          />

          <div className="launch-hero-content">
            <div className="launch-hero-left">
              <div className="launch-badge-row">
                <span className="launch-premier-badge">
                  <Flame size={12} />
                  WORLD PREMIERE DROP
                </span>
                <span className="launch-master-badge">
                  <Sparkles size={12} />
                  24-BIT 96kHz LOSSLESS
                </span>
                <span className="launch-live-badge">JUST DROPPED</span>
              </div>

              <h2 className="launch-hero-title">{heroPremiereTrack.title}</h2>
              <div className="launch-hero-artist-row">
                <span className="launch-hero-artist">{heroPremiereTrack.artist}</span>
                <span className="launch-dot-sep">•</span>
                <span className="launch-hero-album">{heroPremiereTrack.album}</span>
                <span className="launch-dot-sep">•</span>
                <span className="launch-hero-year">2026 Official Premiere</span>
              </div>

              <p className="launch-hero-desc">
                Exclusive high-definition audio premiere on Wavelength. Powered by real-time spatial harmonics,
                lossless dynamic range & ultra-low jitter streaming.
              </p>

              <div className="launch-hero-actions">
                <button
                  className="launch-btn-giant"
                  onClick={() => handleLaunchTrack(heroPremiereTrack)}
                >
                  <Rocket size={20} className={isHeroPlaying ? 'spin-slow' : 'bounce-anim'} />
                  <span>{isHeroPlaying ? 'PAUSE PREMIERE' : '🚀 LAUNCH PREMIERE NOW'}</span>
                </button>

                <button
                  className={`launch-btn-secondary ${isHyped ? 'hyped' : ''}`}
                  onClick={handleHypeClick}
                  title="Hype this drop"
                >
                  <Flame size={16} fill={isHyped ? '#ef4444' : 'none'} color={isHyped ? '#ef4444' : 'currentColor'} />
                  <span>{hypeCount} Hypes</span>
                </button>

                <button
                  className="launch-btn-secondary"
                  onClick={() => setIsLyricsOpen(true)}
                  title="Open Synchronized Lyrics"
                >
                  <Mic2 size={16} />
                  <span>Lyrics</span>
                </button>

                {heroPremiereTrack.isYouTube && (
                  <button
                    className="launch-btn-secondary"
                    onClick={() => toggleVideoMode('pip')}
                    title="Watch Video Stream"
                  >
                    <Tv size={16} />
                    <span>Video</span>
                  </button>
                )}

                <button
                  className="launch-btn-icon"
                  onClick={handleShare}
                  title="Share Premiere Link"
                >
                  {copiedShare ? <Check size={18} className="text-emerald" /> : <Share2 size={18} />}
                </button>
              </div>
            </div>

            <div className="launch-hero-art-col">
              <div className={`launch-art-container ${isHeroPlaying ? 'playing' : ''}`}>
                <AlbumArt
                  hue={heroPremiereTrack.hue || 280}
                  thumbnail={heroPremiereTrack.thumbnail || heroPremiereTrack.cover}
                  title={heroPremiereTrack.title}
                  artist={heroPremiereTrack.artist}
                  className="launch-hero-cover-art"
                />
                {isHeroPlaying && (
                  <div className="launch-art-glow-ring" style={{ borderColor: `hsl(${heroPremiereTrack.hue || 280} 90% 60%)` }} />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive DJ Sound FX Launchpad */}
      <section className="launch-dj-section">
        <div className="launch-section-header">
          <div className="launch-header-title-wrap">
            <Sliders size={20} className="text-purple" />
            <div>
              <h2 className="launch-section-title">Live DJ Beat Launchpad</h2>
              <p className="launch-section-subtitle">
                Trigger real-time synthesized beats & drops over your music! Tap pads or use keys [1] - [8].
              </p>
            </div>
          </div>
          <div className="pad-status-indicator">
            <Volume2 size={15} />
            <span>WEB AUDIO SYNTH ENGINE ACTIVE</span>
          </div>
        </div>

        <div className="sound-pad-grid">
          {SOUND_PADS.map((pad) => {
            const isActive = activePad === pad.id
            return (
              <button
                key={pad.id}
                className={`sound-pad ${isActive ? 'active-pad' : ''}`}
                style={{
                  '--pad-color': pad.color,
                }}
                onClick={() => triggerPad(pad.id)}
                title={`Trigger ${pad.label} (Press ${pad.key})`}
              >
                <div className="pad-top-row">
                  <span className="pad-key-badge">{pad.key}</span>
                  <span className="pad-emoji">{pad.icon}</span>
                </div>
                <div className="pad-label">{pad.label}</div>
                <div className="pad-sub">{pad.sub}</div>
                {isActive && <div className="pad-ripple-glow" />}
              </button>
            )
          })}
        </div>
      </section>

      {/* Release Radar & Launch Catalog */}
      <section className="launch-catalog-section">
        <div className="launch-section-header">
          <div className="launch-header-title-wrap">
            <TrendingUp size={20} className="text-cyan" />
            <div>
              <h2 className="launch-section-title">Fresh Premieres & Radar Drops</h2>
              <p className="launch-section-subtitle">
                Newly dropped singles, viral tracks, and exclusive streaming masters.
              </p>
            </div>
          </div>

          <div className="launch-filter-pills">
            {[
              { id: 'all', label: 'All Premieres' },
              { id: 'bollywood', label: 'Bollywood Drops' },
              { id: 'hollywood', label: 'Global Billboard' },
              { id: 'edm', label: 'EDM & Club' },
              { id: 'video', label: 'Live Video Streams' },
            ].map((f) => (
              <button
                key={f.id}
                className={`launch-filter-pill ${activeFilter === f.id ? 'active' : ''}`}
                onClick={() => {
                  haptics.impact()
                  setActiveFilter(f.id)
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="launch-drops-grid">
          {launchDrops.map((item, index) => {
            const isThisPlaying = isPlaying && currentId === item.id
            return (
              <div
                key={item.id}
                className={`launch-drop-card ${isThisPlaying ? 'is-playing' : ''}`}
                onClick={() => handleLaunchTrack(item)}
              >
                <div className="drop-card-art-wrap">
                  <div
                    className="drop-card-art"
                    style={{
                      background: item.thumbnail
                        ? `url(${item.thumbnail}) center/cover no-repeat`
                        : `linear-gradient(135deg, hsl(${item.hue || 260}, 75%, 40%), hsl(${(item.hue || 260) + 50}, 85%, 20%))`,
                    }}
                  >
                    <div className="drop-card-overlay">
                      <button className="drop-card-play-btn" aria-label={`Play ${item.title}`}>
                        {isThisPlaying ? (
                          <Pause size={18} fill="#000" />
                        ) : (
                          <Play size={18} fill="#000" />
                        )}
                      </button>
                    </div>

                    <div className="drop-badge-strip">
                      {index === 0 && <span className="drop-tag-gold">#1 TRENDING</span>}
                      {index === 1 && <span className="drop-tag-purple">EXCLUSIVE</span>}
                      {item.isVideoStream && <span className="drop-tag-red">LIVE VIDEO</span>}
                      {item.isOfflineReady && <span className="drop-tag-cyan">OFFLINE MASTER</span>}
                    </div>
                  </div>
                </div>

                <div className="drop-card-body">
                  <div className="drop-card-title" title={item.title}>
                    {item.title}
                  </div>
                  <div className="drop-card-artist" title={item.artist}>
                    {item.isLive ? 'Live Radio Stream' : item.artist}
                  </div>

                  <div className="drop-card-meta-row">
                    <span className="drop-genre-tag">{item.genre || 'Electronic'}</span>
                    <button
                      className="drop-quick-launch-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLaunchTrack(item)
                      }}
                      title="Launch track now"
                    >
                      <Rocket size={13} />
                      <span>Launch</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
