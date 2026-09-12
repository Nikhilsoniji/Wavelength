import { useState, useEffect, useRef } from 'react'
import { useAudioEngine } from './hooks/useAudioEngine'
import { usePlayerStore } from './store/usePlayerStore'
import Sidebar from './components/Sidebar'
import Library from './components/Library'
import Queue from './components/Queue'
import Radio from './components/Radio'
import AiDj from './components/AiDj'
import PlayerBar from './components/PlayerBar'
import OnboardingScreen from './components/OnboardingScreen'
import AuthScreen from './components/AuthScreen'
import LandingPage from './components/LandingPage'
import ImportYouTubeModal from './components/ImportYouTubeModal'
import { WavelengthLogo } from './components/RealLogos'
import {
  Sparkles,
  Search,
  Upload,
  Play,
  Pause,
  User,
  Disc3,
  Headphones,
  Youtube,
} from 'lucide-react'

const AI_CARDS = [
  {
    id: 'neon',
    tag: 'Synthwave Focus',
    title: 'Neon Horizons',
    desc: 'A personalized journey through retro-futuristic soundscapes, mixed for deep flow.',
    color: '#cabeff',
    bg: 'linear-gradient(135deg, rgba(26, 5, 51, 0.9) 0%, rgba(45, 10, 107, 0.8) 40%, rgba(10, 26, 61, 0.9) 100%)',
    trackId: 't1',
  },
  {
    id: 'midnight',
    tag: 'Ambient Drift',
    title: 'Midnight Rain',
    desc: 'Deep textures, spatial lo-fi, and warm acoustic frequencies.',
    color: '#a2e7ff',
    bg: 'linear-gradient(135deg, rgba(0, 26, 44, 0.9) 0%, rgba(0, 48, 66, 0.8) 50%, rgba(10, 10, 20, 0.9) 100%)',
    trackId: 't2',
  },
  {
    id: 'solar',
    tag: 'Deep Spatial',
    title: 'Solar Winds',
    desc: 'Ambient electronic journeys expanding across immersive sonic dimensions.',
    color: '#ec4899',
    bg: 'linear-gradient(135deg, rgba(30, 0, 50, 0.9) 0%, rgba(60, 0, 80, 0.8) 50%, rgba(10, 5, 30, 0.9) 100%)',
    trackId: 't3',
  },
]

const QUICK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'spatial', label: 'Spatial Audio' },
  { id: 'lossless', label: 'Lossless' },
  { id: 'radio', label: 'Live Radio' },
  { id: 'ambient', label: 'AI Mixes' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function App() {
  const [flowStep, setFlowStep] = useState(() => {
    try {
      return localStorage.getItem('wavelength_flow_step') || 'main'
    } catch {
      return 'main'
    }
  })
  const [view, setView] = useState('library')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false)

  const updateFlowStep = (step) => {
    setFlowStep(step)
    try {
      localStorage.setItem('wavelength_flow_step', step)
    } catch {}
  }

  const { seekTo } = useAudioEngine()
  const track = usePlayerStore((s) => s.currentTrack())
  const currentId = usePlayerStore((s) => s.currentId)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const toggle = usePlayerStore((s) => s.toggle)
  const play = usePlayerStore((s) => s.play)
  const loadSavedTracks = usePlayerStore((s) => s.loadSavedTracks)
  const loadSavedPlaylists = usePlayerStore((s) => s.loadSavedPlaylists)
  const loadRadioStations = usePlayerStore((s) => s.loadRadioStations)
  const addUploadedTrack = usePlayerStore((s) => s.addUploadedTrack)
  const library = usePlayerStore((s) => s.library)
  const savedPlaylists = usePlayerStore((s) => s.savedPlaylists)
  const playPlaylist = usePlayerStore((s) => s.playPlaylist)

  const fileInputRef = useRef(null)

  useEffect(() => {
    loadSavedTracks()
    loadSavedPlaylists()
    loadRadioStations()
  }, [loadSavedTracks, loadSavedPlaylists, loadRadioStations])

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      addUploadedTrack(file)
      e.target.value = ''
    }
  }

  // Flow Routing
  if (flowStep === 'landing') {
    return <LandingPage onBack={() => updateFlowStep('main')} />
  }
  if (flowStep === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={() => updateFlowStep('auth')}
        onDownload={() => updateFlowStep('landing')}
      />
    )
  }
  if (flowStep === 'auth') {
    return <AuthScreen onComplete={() => updateFlowStep('main')} />
  }

  const recentTracks = library.length > 0 ? library.slice(0, 6) : []

  return (
    <div className="stitch-shell">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="audio/*"
        style={{ display: 'none' }}
      />

      {/* Top Navigation */}
      <header className="stitch-topbar">
        <div className="stitch-topbar-brand" onClick={() => setView('library')} role="button" tabIndex={0}>
          <WavelengthLogo size={32} glowing={false} />
          <div className="brand-header-info">
            <span className="brand-header-name">Wavelength</span>
          </div>
        </div>

        <div className="stitch-topbar-center">
          <div className="topbar-search-wrap">
            <Search size={16} className="search-icon-dim" />
            <input
              type="text"
              placeholder="Search tracks, artists, radio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="topbar-search-input"
            />
          </div>
        </div>

        <div className="stitch-topbar-actions">
          <button
            className="stitch-topbar-btn yt-topbar-btn"
            onClick={() => setIsYouTubeModalOpen(true)}
            title="Import YouTube Playlist"
          >
            <Youtube size={18} className="yt-icon-topbar" />
          </button>
          <button
            className="stitch-topbar-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Audio"
          >
            <Upload size={18} />
          </button>
          <button
            className="stitch-topbar-btn"
            onClick={() => updateFlowStep('landing')}
            title="About Wavelength"
          >
            <Sparkles size={18} />
          </button>
          <button
            className="stitch-topbar-btn user-avatar-btn"
            onClick={() => updateFlowStep('auth')}
            title="Account"
          >
            <User size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="stitch-main" key={view}>
        {view === 'library' && (
          <div className="stitch-home">
            {/* Greeting */}
            <div className="stitch-greeting">
              <h1 className="stitch-greeting-title">{getGreeting()}</h1>
              <p className="stitch-greeting-sub">
                Your personal music library, curated just for you.
              </p>
            </div>

            {/* Now Playing Banner */}
            <section className="hero-spatial-banner">
              <div className="hero-banner-grid">
                <div className="hero-banner-info">
                  <div className="hero-banner-tag">
                    <Sparkles size={14} />
                    <span>NOW PLAYING</span>
                  </div>
                  <h2 className="hero-banner-title">
                    {track ? track.title : 'Start Listening'}
                  </h2>
                  <p className="hero-banner-desc">
                    {track
                      ? `${track.artist} — ${track.album}`
                      : 'Pick a track from your library or explore curated mixes below.'}
                  </p>

                  <div className="hero-banner-actions">
                    <button
                      className="hero-play-main-btn"
                      onClick={() => (track ? toggle() : play(library[0]?.id || 't1'))}
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={18} fill="currentColor" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play size={18} fill="currentColor" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Filter Pills */}
            <div className="quick-filters-row">
              {QUICK_FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`filter-pill-btn ${activeFilter === f.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter(f.id)
                    if (f.id === 'radio') setView('radio')
                    if (f.id === 'ambient') setView('aidj')
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Made for You — AI Mixes */}
            <section className="stitch-section">
              <div className="stitch-section-header">
                <h2 className="stitch-section-title">
                  <Sparkles size={20} />
                  <span>Made for You</span>
                </h2>
                <button className="stitch-see-all" onClick={() => setView('aidj')}>
                  See All →
                </button>
              </div>

              <div className="stitch-cards-scroll">
                {AI_CARDS.map((card) => {
                  const isThisPlaying = isPlaying && currentId === card.trackId
                  return (
                    <div
                      key={card.id}
                      className="stitch-hero-card"
                      style={{ background: card.bg }}
                      onClick={() => (isThisPlaying ? toggle() : play(card.trackId))}
                    >
                      <div className="stitch-hero-card-body">
                        <div className="stitch-hero-tag">
                          <span className="stitch-pulse-dot" style={{ background: card.color }} />
                          <span style={{ color: card.color }}>{card.tag}</span>
                        </div>
                        <h3 className="stitch-hero-title">{card.title}</h3>
                        <p className="stitch-hero-desc">{card.desc}</p>
                        <div className="stitch-hero-footer">
                          <div className="stitch-avatar-stack">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="stitch-avatar"
                                style={{ background: `hsl(${200 + i * 40}, 75%, 50%)` }}
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                            ))}
                          </div>
                          <button className="stitch-hero-play" aria-label={`Play ${card.title}`}>
                            {isThisPlaying ? (
                              <Pause size={20} fill="#000" />
                            ) : (
                              <Play size={20} fill="#000" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Saved Playlists */}
            {savedPlaylists.length > 0 && (
              <section className="stitch-section">
                <div className="stitch-section-header">
                  <h2 className="stitch-section-title">
                    <Youtube size={20} className="yt-icon-red" />
                    <span>Saved Playlists</span>
                  </h2>
                  <button className="stitch-see-all" onClick={() => setIsYouTubeModalOpen(true)}>
                    Manage ({savedPlaylists.length}) →
                  </button>
                </div>

                <div className="stitch-small-cards-scroll">
                  {savedPlaylists.map((pl) => {
                    const isThisPlaying = isPlaying && pl.tracks?.some((t) => t.id === currentId)
                    return (
                      <div
                        key={pl.id}
                        className={`stitch-small-card yt-playlist-card ${isThisPlaying ? 'is-playing-card' : ''}`}
                        onClick={() => playPlaylist(pl)}
                        title={`Play "${pl.title}" (${pl.trackCount || pl.tracks?.length} tracks)`}
                      >
                        <div
                          className="stitch-small-art"
                          style={{
                            background: pl.thumbnail
                              ? `url(${pl.thumbnail}) center/cover no-repeat`
                              : `linear-gradient(135deg, #ff0033 0%, #330011 100%)`,
                          }}
                        >
                          <div className="stitch-small-art-overlay">
                            <button className="stitch-small-play" aria-label={`Play ${pl.title}`}>
                              {isThisPlaying ? (
                                <Pause size={18} fill="#000" />
                              ) : (
                                <Play size={18} fill="#000" />
                              )}
                            </button>
                          </div>
                          <div className="yt-card-badge">
                            <Youtube size={10} className="yt-icon-red" />
                            <span>{pl.trackCount || pl.tracks?.length || 0}</span>
                          </div>
                          {isThisPlaying && (
                            <div className="card-live-eq">
                              <span className="eq-bar-s" />
                              <span className="eq-bar-s" />
                              <span className="eq-bar-s" />
                            </div>
                          )}
                        </div>
                        <div className="stitch-small-info">
                          <div className="stitch-small-title">{pl.title}</div>
                          <div className="stitch-small-artist">
                            {pl.author} • Saved
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Recently Played */}
            <section className="stitch-section">
              <div className="stitch-section-header">
                <h2 className="stitch-section-title">
                  <Disc3 size={20} />
                  <span>Recently Played</span>
                </h2>
                <button className="stitch-see-all" onClick={() => setView('queue')}>
                  Queue ({library.length}) →
                </button>
              </div>

              <div className="stitch-small-cards-scroll">
                {recentTracks.map((t) => {
                  const isThisPlaying = isPlaying && currentId === t.id
                  return (
                    <div
                      key={t.id}
                      className={`stitch-small-card ${isThisPlaying ? 'is-playing-card' : ''}`}
                      onClick={() => (isThisPlaying ? toggle() : play(t.id))}
                    >
                      <div
                        className="stitch-small-art"
                        style={{
                          background: t.thumbnail
                            ? `url(${t.thumbnail}) center/cover no-repeat`
                            : `linear-gradient(135deg, hsl(${t.hue || 260}, 75%, 40%), hsl(${(t.hue || 260) + 50}, 85%, 20%))`,
                        }}
                      >
                        <div className="stitch-small-art-overlay">
                          <button className="stitch-small-play" aria-label={`Play ${t.title}`}>
                            {isThisPlaying ? (
                              <Pause size={18} fill="#000" />
                            ) : (
                              <Play size={18} fill="#000" />
                            )}
                          </button>
                        </div>
                        {isThisPlaying && (
                          <div className="card-live-eq">
                            <span className="eq-bar-s" />
                            <span className="eq-bar-s" />
                            <span className="eq-bar-s" />
                          </div>
                        )}
                      </div>
                      <div className="stitch-small-info">
                        <div className="stitch-small-title">{t.title}</div>
                        <div className="stitch-small-artist">
                          {t.isLive ? 'Live Radio' : t.artist}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Full Library */}
            <section className="stitch-section stitch-section-last">
              <div className="stitch-section-header">
                <h2 className="stitch-section-title">
                  <Headphones size={20} />
                  <span>Your Library</span>
                </h2>
              </div>
              <Library onOpenYouTubeModal={() => setIsYouTubeModalOpen(true)} />
            </section>
          </div>
        )}

        {view === 'search' && (
          <div className="stitch-view-page">
            <Library onOpenYouTubeModal={() => setIsYouTubeModalOpen(true)} />
          </div>
        )}
        {view === 'queue' && (
          <div className="stitch-view-page">
            <Queue />
          </div>
        )}
        {view === 'aidj' && (
          <div className="stitch-view-page">
            <AiDj />
          </div>
        )}
        {view === 'radio' && (
          <div className="stitch-view-page">
            <Radio />
          </div>
        )}
      </main>

      <PlayerBar seekTo={seekTo} />
      <Sidebar view={view} setView={setView} />

      <ImportYouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
      />
    </div>
  )
}
