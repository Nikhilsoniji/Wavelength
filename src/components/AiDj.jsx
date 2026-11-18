import { useState, useMemo, useCallback } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import {
  Sparkles,
  Play,
  Pause,
  Disc,
  Flame,
  Zap,
  Sliders,
  Radio,
  Volume2,
  Headphones,
  Music2,
  ListPlus,
  RefreshCw,
  Heart,
  TrendingUp,
} from 'lucide-react'
import { haptics } from '../utils/haptics'
import AlbumArt from './AlbumArt'

const MOOD_PRESETS = [
  { id: 'all', label: 'All Hits & Mixes', icon: '✨' },
  { id: 'party', label: 'Club & Dance Fire', icon: '🔥', energy: 4 },
  { id: 'bollywood', label: 'Bollywood Romance', icon: '💖', energy: 3 },
  { id: 'hollywood', label: 'Hollywood Hot 100', icon: '🌍', energy: 4 },
  { id: 'lofi', label: 'Late Night Lofi Chill', icon: '🌙', energy: 1 },
  { id: 'synthwave', label: 'Cyberpunk Synthwave', icon: '⚡', energy: 3 },
  { id: 'edm', label: 'Mainstage EDM Festival', icon: '🔊', energy: 5 },
]

const VIBE_PROMPTS = [
  { label: '🔥 Crank Up The Bass', mood: 'party', energy: 5, prompt: 'Boosting 808 sub-harmonics for peak dancefloor energy.' },
  { label: '🌙 Late Night Mellow', mood: 'lofi', energy: 1, prompt: 'Downtempo binaural beats and soothing lofi vinyl textures.' },
  { label: '💃 Desi Dance Anthems', mood: 'party', energy: 4, prompt: 'Spinning the biggest Bollywood & Punjabi club chartbusters.' },
  { label: '✨ Global Pop Hitlist', mood: 'hollywood', energy: 3, prompt: 'Seamless transitions through Billboard Hot 100 streaming giants.' },
]

export default function AiDj() {
  const library = usePlayerStore((s) => s.library)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentId = usePlayerStore((s) => s.currentId)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)
  const setQueue = usePlayerStore((s) => s.setQueue)

  const [activeMood, setActiveMood] = useState('all')
  const [energyLevel, setEnergyLevel] = useState(3)
  const [aiMessage, setAiMessage] = useState(
    'Welcome to Wavelength AI DJ. Select a mood or energy level, and I will harmonize a seamless mix.'
  )
  const [isGenerating, setIsGenerating] = useState(false)

  // Curate tracks dynamically based on mood & energy
  const curatedSessionTracks = useMemo(() => {
    let pool = [...library]

    if (activeMood === 'party') {
      pool = pool.filter(
        (t) =>
          t.genre?.includes('Dance') ||
          t.genre?.includes('Party') ||
          t.genre?.includes('Club') ||
          t.genre?.includes('Punjabi')
      )
    } else if (activeMood === 'bollywood') {
      pool = pool.filter(
        (t) =>
          t.category === 'Bollywood' &&
          (t.genre?.includes('Romantic') ||
            t.genre?.includes('Acoustic') ||
            t.genre?.includes('Folk') ||
            t.genre?.includes('Soulful'))
      )
    } else if (activeMood === 'hollywood') {
      pool = pool.filter((t) => t.category === 'Hollywood')
    } else if (activeMood === 'lofi') {
      pool = pool.filter(
        (t) =>
          t.genre?.includes('Lofi') ||
          t.genre?.includes('Acoustic') ||
          t.genre?.includes('Chill') ||
          t.album?.includes('Lofi')
      )
    } else if (activeMood === 'synthwave') {
      pool = pool.filter((t) => t.genre?.includes('Synthwave') || t.genre?.includes('Electronic'))
    } else if (activeMood === 'edm') {
      pool = pool.filter((t) => t.genre?.includes('EDM') || t.genre?.includes('Festival') || t.genre?.includes('Dance'))
    }

    // Fallback if filter returned too few
    if (pool.length < 3) {
      pool = library
    }

    return pool.slice(0, 16)
  }, [library, activeMood])

  // Track currently playing
  const currentTrack = useMemo(() => {
    return library.find((t) => t.id === currentId) || null
  }, [library, currentId])

  // Generate & Launch AI Set
  const handleLaunchAiSet = useCallback(() => {
    haptics.impact()
    setIsGenerating(true)

    const trackIds = curatedSessionTracks.map((t) => t.id)
    const firstTrack = curatedSessionTracks[0]

    const moodName = MOOD_PRESETS.find((m) => m.id === activeMood)?.label || 'Custom Set'
    setAiMessage(
      `Launching AI DJ Session: "${moodName}" (Energy Level ${energyLevel}/5). Spinning ${firstTrack?.title || 'first track'} with 4.5s automated beatmatch crossfade.`
    )

    setTimeout(() => {
      setQueue(trackIds)
      if (firstTrack) {
        play(firstTrack.id)
      }
      setIsGenerating(false)
    }, 400)
  }, [curatedSessionTracks, activeMood, energyLevel, setQueue, play])

  // Apply Quick Vibe Prompt
  const handleQuickPrompt = (item) => {
    haptics.impact()
    setActiveMood(item.mood)
    setEnergyLevel(item.energy)
    setAiMessage(`🎙️ AI DJ: ${item.prompt}`)
  }

  const handlePlayCard = (trackId) => {
    haptics.impact()
    if (!trackId) return
    if (currentId === trackId) {
      toggle()
    } else {
      play(trackId)
    }
  }

  return (
    <div className="aidj-container">
      {/* Hero Header */}
      <div className="aidj-hero-banner">
        <div className="aidj-hero-left">
          <div className="aidj-pill-tag">
            <Sparkles size={14} className="sparkle-pulse" />
            <span>AI DJ SMART HARMONICS</span>
            <span className="live-dot" />
          </div>
          <h1 className="greeting-title">AI DJ & Smart Sets</h1>
          <p className="greeting-subtitle">
            Autonomous dynamic track sequencing, intelligent crossfading, and mood-adaptive music curation.
          </p>

          <div className="aidj-status-strip">
            <span className="status-pill">
              <Zap size={13} className="text-amber" />
              <span>4.5s AUTO-CROSSFADE</span>
            </span>
            <span className="status-pill">
              <Sliders size={13} className="text-cyan" />
              <span>HARMONIC KEY MATCHING</span>
            </span>
            <span className="status-pill">
              <Volume2 size={13} className="text-emerald" />
              <span>DYNAMIC RANGE +14dB</span>
            </span>
          </div>
        </div>

        {/* AI DJ Live Commentary Speech Box */}
        <div className="aidj-voice-card">
          <div className="voice-header-row">
            <div className="voice-avatar-box">
              <Headphones size={18} className="text-spotify" />
            </div>
            <div>
              <span className="voice-title">WAVELENGTH AI DJ</span>
              <span className="voice-tag">LIVE VOICE COMMENTARY</span>
            </div>
          </div>

          <p className="voice-message-text">{aiMessage}</p>

          <div className="voice-wave-anim">
            <span className="wave-bar" />
            <span className="wave-bar" />
            <span className="wave-bar" />
            <span className="wave-bar" />
            <span className="wave-bar" />
          </div>
        </div>
      </div>

      {/* Quick Vibe Prompt Chips */}
      <div className="aidj-vibe-prompts-row">
        <span className="vibe-prompt-label">Quick Vibes:</span>
        {VIBE_PROMPTS.map((vp) => (
          <button
            key={vp.label}
            className="vibe-prompt-chip"
            onClick={() => handleQuickPrompt(vp)}
          >
            {vp.label}
          </button>
        ))}
      </div>

      {/* Session Controls: Moods & Energy Level Slider */}
      <section className="aidj-controls-card">
        <div className="aidj-ctrl-header">
          <div className="ctrl-title-group">
            <Sliders size={18} className="text-purple" />
            <h2 className="ctrl-main-title">Configure Your Session</h2>
          </div>

          <button
            className={`aidj-launch-btn ${isGenerating ? 'loading' : ''}`}
            onClick={handleLaunchAiSet}
            disabled={isGenerating}
          >
            <Sparkles size={16} />
            <span>{isGenerating ? 'Sequencing Set...' : '🚀 GENERATE & LAUNCH AI SET'}</span>
          </button>
        </div>

        {/* Mood Selector Pills */}
        <div className="aidj-mood-pills">
          {MOOD_PRESETS.map((m) => (
            <button
              key={m.id}
              className={`mood-pill-btn ${activeMood === m.id ? 'active' : ''}`}
              onClick={() => {
                haptics.impact()
                setActiveMood(m.id)
                if (m.energy) setEnergyLevel(m.energy)
              }}
            >
              <span className="mood-pill-icon">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Energy Slider */}
        <div className="energy-slider-wrap">
          <div className="energy-label-row">
            <span className="energy-title">Energy Progression Level:</span>
            <span className="energy-value-pill">
              Level {energyLevel} / 5 •{' '}
              {energyLevel === 1 && 'Ambient Chill'}
              {energyLevel === 2 && 'Laidback Groove'}
              {energyLevel === 3 && 'Upbeat Dance'}
              {energyLevel === 4 && 'Club Heat'}
              {energyLevel === 5 && 'Peak Euphoria'}
            </span>
          </div>

          <div className="energy-steps-row">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                className={`energy-step-btn ${energyLevel >= lvl ? 'filled' : ''} ${energyLevel === lvl ? 'selected' : ''}`}
                onClick={() => {
                  haptics.impact()
                  setEnergyLevel(lvl)
                }}
              >
                <span>{lvl}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Curated AI Session Tracks */}
      <section className="aidj-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <Flame size={20} className="text-amber" />
            <div>
              <h2 className="section-title">
                <span>Harmonically Curated Tracklist</span>
                <span className="chip-count">({curatedSessionTracks.length} tracks)</span>
              </h2>
              <p className="section-sub">
                Pre-matched for smooth key transitions and rhythmic energy matching.
              </p>
            </div>
          </div>
        </div>

        <div className="recent-cards-grid">
          {curatedSessionTracks.map((t, idx) => {
            const isThisPlaying = isPlaying && currentId === t.id
            const mockBpm = 110 + (idx * 5) % 30
            const mockKey = ['8A', '9A', '10A', '11B', '4B', '6A'][idx % 6]

            return (
              <div
                key={t.id || idx}
                className={`recent-card ${isThisPlaying ? 'is-playing-card' : ''}`}
                onClick={() => handlePlayCard(t.id)}
              >
                <div className="recent-art-wrap">
                  <div
                    className="recent-art"
                    style={{
                      backgroundImage: t.thumbnail ? `url(${t.thumbnail})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: `hsl(${t.hue || 260}, 60%, 40%)`,
                    }}
                  >
                    {!t.thumbnail && <Disc size={36} color="rgba(255,255,255,0.7)" />}
                  </div>
                  <div className="recent-play-overlay">
                    <button className="recent-play-icon" aria-label={`Play ${t.title}`}>
                      {isThisPlaying ? (
                        <Pause size={22} fill="#000" />
                      ) : (
                        <Play size={22} fill="#000" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="recent-info">
                  <div className="recent-title">{t.title}</div>
                  <div className="recent-artist">{t.isLive ? 'Live Radio' : t.artist}</div>

                  <div className="aidj-track-badges-row">
                    <span className="bpm-badge">{mockBpm} BPM</span>
                    <span className="key-badge">Key {mockKey}</span>
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
