import { useState, useEffect, useRef } from 'react'
import { useAudioEngine } from './hooks/useAudioEngine'
import { usePlayerStore } from './store/usePlayerStore'
import Sidebar from './components/Sidebar'
import Library from './components/Library'
import Queue from './components/Queue'
import Radio from './components/Radio'
import AiDj from './components/AiDj'
import PlayerBar from './components/PlayerBar'
import Background3D from './components/Background3D'
import OnboardingScreen from './components/OnboardingScreen'
import AuthScreen from './components/AuthScreen'
import LandingPage from './components/LandingPage'
import { Sparkles, Search, Upload, Play, User } from 'lucide-react'

const AI_CARDS = [
  {
    id: 'neon',
    tag: 'Synthwave Focus',
    title: 'Neon Horizons',
    desc: 'A personalized journey through retro-futuristic soundscapes, mixed just for you.',
    color: '#cabeff',
    bg: 'linear-gradient(135deg, #1a0533 0%, #2d0a6b 40%, #0a1a3d 100%)',
  },
  {
    id: 'midnight',
    tag: 'Ambient Drift',
    title: 'Midnight Rain',
    desc: 'Deep textures and lo-fi beats designed to help you focus or fade away.',
    color: '#a2e7ff',
    bg: 'linear-gradient(135deg, #001a2c 0%, #003042 50%, #0a0a14 100%)',
  },
  {
    id: 'solar',
    tag: 'Deep Focus',
    title: 'Solar Winds',
    desc: 'Ambient electronic journeys that expand your mind across cosmic frequencies.',
    color: '#cdbdff',
    bg: 'linear-gradient(135deg, #0d0033 0%, #1a004d 50%, #000d1a 100%)',
  },
]

const RECENT_TRACKS = [
  { id: 'r1', title: 'Dark Matter',  artist: 'The Void',   hue: 260 },
  { id: 'r2', title: 'Night Drive',  artist: 'Kavinsky',   hue: 200 },
  { id: 'r3', title: 'Resonance',    artist: 'HOME',        hue: 180 },
  { id: 'r4', title: 'Tape Loops',   artist: 'Lorn',        hue: 300 },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function App() {
  const [flowStep, setFlowStep] = useState('onboarding')
  const [view, setView] = useState('library')
  const [searchActive, setSearchActive] = useState(false)
  const { seekTo } = useAudioEngine()
  const track     = usePlayerStore((s) => s.currentTrack())
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const toggle    = usePlayerStore((s) => s.toggle)
  const play      = usePlayerStore((s) => s.play)
  const loadSavedTracks   = usePlayerStore((s) => s.loadSavedTracks)
  const loadRadioStations = usePlayerStore((s) => s.loadRadioStations)
  const addUploadedTrack  = usePlayerStore((s) => s.addUploadedTrack)
  const library = usePlayerStore((s) => s.library)

  const fileInputRef = useRef(null)

  useEffect(() => {
    loadSavedTracks()
    loadRadioStations()
  }, [loadSavedTracks, loadRadioStations])

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) { addUploadedTrack(file); e.target.value = '' }
  }

  // Flows
  if (flowStep === 'landing')    return <LandingPage onBack={() => setFlowStep('onboarding')} />
  if (flowStep === 'onboarding') return <OnboardingScreen onComplete={() => setFlowStep('auth')} onDownload={() => setFlowStep('landing')} />
  if (flowStep === 'auth')       return <AuthScreen onComplete={() => setFlowStep('main')} />

  // Recent tracks from library (last 4), fallback to demo
  const recentTracks = library.length > 0
    ? library.slice(-4).reverse()
    : RECENT_TRACKS

  return (
    <div className="stitch-shell">
      <Background3D />

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" style={{ display: 'none' }} />

      {/* Top Header */}
      <header className="stitch-topbar glass-card">
        <div className="stitch-topbar-brand">
          <div className="stitch-logo">W</div>
          <span className="stitch-topbar-title">{view === 'library' ? 'Home' : view === 'aidj' ? 'AI DJ' : view === 'queue' ? 'Library' : 'Radio'}</span>
        </div>
        <div className="stitch-topbar-actions">
          <button className="stitch-topbar-btn" onClick={() => fileInputRef.current?.click()} title="Upload Track">
            <Upload size={18} />
          </button>
          <button className="stitch-topbar-btn" onClick={() => setFlowStep('onboarding')} title="Account">
            <User size={18} />
          </button>
        </div>
      </header>

      {/* Main scrollable area */}
      <main className="stitch-main">

        {/* HOME VIEW */}
        {view === 'library' && (
          <div className="stitch-home">
            {/* Greeting */}
            <div className="stitch-greeting">
              <h1 className="stitch-greeting-title">{getGreeting()}</h1>
              <p className="stitch-greeting-sub">Here's your daily frequency.</p>
            </div>

            {/* Search bar */}
            <div className="stitch-search-bar glass-card">
              <Search size={18} className="stitch-search-icon" />
              <input
                className="stitch-search-input"
                placeholder="What are you looking for?"
                type="text"
                onFocus={() => setSearchActive(true)}
                onBlur={() => setSearchActive(false)}
              />
            </div>

            {/* AI Recommended */}
            <section className="stitch-section">
              <div className="stitch-section-header">
                <h2 className="stitch-section-title">
                  <Sparkles size={18} className="stitch-section-icon" />
                  AI Recommended
                </h2>
              </div>
              <div className="stitch-cards-scroll">
                {AI_CARDS.map((card) => (
                  <div key={card.id} className="stitch-hero-card" style={{ background: card.bg }}>
                    <div className="stitch-hero-card-overlay" />
                    <div className="stitch-hero-card-ring" />
                    <div className="stitch-hero-card-body">
                      <div className="stitch-hero-tag">
                        <span className="stitch-pulse-dot" style={{ background: card.color }} />
                        <span style={{ color: card.color }}>{card.tag}</span>
                      </div>
                      <h3 className="stitch-hero-title">{card.title}</h3>
                      <p className="stitch-hero-desc">{card.desc}</p>
                      <div className="stitch-hero-footer">
                        <div className="stitch-avatar-stack">
                          {[0,1,2].map(i => (
                            <div key={i} className="stitch-avatar" style={{ background: `hsl(${200 + i*40},70%,55%)` }}>
                              {String.fromCharCode(65 + i)}
                            </div>
                          ))}
                        </div>
                        <button className="stitch-hero-play" style={{ boxShadow: `0 0 20px ${card.color}66` }}>
                          <Play size={20} fill="#fff" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recently Played */}
            <section className="stitch-section">
              <div className="stitch-section-header">
                <h2 className="stitch-section-title">Recently Played</h2>
                <button className="stitch-see-all" onClick={() => setView('queue')}>See All</button>
              </div>
              <div className="stitch-small-cards-scroll">
                {recentTracks.map((t) => (
                  <div key={t.id} className="stitch-small-card" onClick={() => play && play(t.id)}>
                    <div className="stitch-small-art" style={{ background: `linear-gradient(135deg, hsl(${t.hue},70%,35%), hsl(${(t.hue+60)%360},70%,25%))` }}>
                      <div className="stitch-small-art-overlay">
                        <button className="stitch-small-play">
                          <Play size={16} fill="#fff" />
                        </button>
                      </div>
                    </div>
                    <div className="stitch-small-info">
                      <div className="stitch-small-title">{t.title}</div>
                      <div className="stitch-small-artist">{t.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Library quick access */}
            <section className="stitch-section stitch-section-last">
              <div className="stitch-section-header">
                <h2 className="stitch-section-title">Your Library</h2>
                <button className="stitch-see-all" onClick={() => setView('queue')}>See All</button>
              </div>
              <Library compact />
            </section>
          </div>
        )}

        {/* OTHER VIEWS */}
        {view === 'search'  && <div className="stitch-view-page"><Library /></div>}
        {view === 'queue'   && <div className="stitch-view-page"><Queue /></div>}
        {view === 'aidj'    && <div className="stitch-view-page"><AiDj /></div>}
        {view === 'radio'   && <div className="stitch-view-page"><Radio /></div>}
      </main>

      {/* Floating Player */}
      <PlayerBar seekTo={seekTo} />

      {/* Bottom Nav */}
      <Sidebar view={view} setView={setView} />
    </div>
  )
}
