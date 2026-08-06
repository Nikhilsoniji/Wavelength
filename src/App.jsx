import { useState, useEffect, useRef } from 'react'
import { useAudioEngine } from './hooks/useAudioEngine'
import { usePlayerStore } from './store/usePlayerStore'
import Sidebar from './components/Sidebar'
import Library from './components/Library'
import Queue from './components/Queue'
import Radio from './components/Radio'
import AiDj from './components/AiDj'
import PlayerBar from './components/PlayerBar'
import VinylDeck3D from './components/VinylDeck3D'
import Background3D from './components/Background3D'
import OnboardingScreen from './components/OnboardingScreen'
import AuthScreen from './components/AuthScreen'
import OnboardingModal from './components/OnboardingModal'
import AuthModal from './components/AuthModal'
import LandingPage from './components/LandingPage'
import { Play, Pause, Sparkles, User, HelpCircle, LogOut } from 'lucide-react'

export default function App() {
  // Ordered Initial App Flow: 'onboarding' -> 'auth' -> 'main'
  const [flowStep, setFlowStep] = useState('onboarding')

  const [view, setView] = useState('library')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)

  const { seekTo } = useAudioEngine()
  const track = usePlayerStore((s) => s.currentTrack())
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const toggle = usePlayerStore((s) => s.toggle)
  const loadSavedTracks = usePlayerStore((s) => s.loadSavedTracks)
  const loadRadioStations = usePlayerStore((s) => s.loadRadioStations)
  const addUploadedTrack = usePlayerStore((s) => s.addUploadedTrack)

  const fileInputRef = useRef(null)

  useEffect(() => {
    loadSavedTracks()
    loadRadioStations()
  }, [loadSavedTracks, loadRadioStations])

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      addUploadedTrack(file)
      e.target.value = ''
    }
  }

  // STEP 0: Landing Page (shown when Download App is clicked from onboarding)
  if (flowStep === 'landing') {
    return <LandingPage onBack={() => setFlowStep('onboarding')} />
  }

  // STEP 1: Fullscreen Onboarding Flow
  if (flowStep === 'onboarding') {
    return <OnboardingScreen onComplete={() => setFlowStep('auth')} onDownload={() => setFlowStep('landing')} />
  }

  // STEP 2: Fullscreen Authentication / Login Flow
  if (flowStep === 'auth') {
    return <AuthScreen onComplete={() => setFlowStep('main')} />
  }

  // STEP 3: Main Wavelength 3D Application
  return (
    <div className="app-shell">
      {/* Interactive 3D Ambient WebGL Particles */}
      <Background3D />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="audio/*"
        style={{ display: 'none' }}
      />
      
      <header className="topbar glass-header">
        <div className="topbar-brand">
          <div className="topbar-logo badge-3d">W</div>
          <div>
            <div className="topbar-title">Wavelength 3D</div>
            <div className="topbar-subtitle">Spatial Audio Experience</div>
          </div>
        </div>

        <div className="topbar-links">
          <button className={`topbar-link${view === 'library' ? ' active' : ''}`} onClick={() => setView('library')}>
            Library
          </button>
          <button className={`topbar-link${view === 'aidj' ? ' active' : ''}`} onClick={() => setView('aidj')}>
            <Sparkles size={14} style={{ display: 'inline', marginRight: 4 }} />
            AI DJ
          </button>
          <button className={`topbar-link${view === 'queue' ? ' active' : ''}`} onClick={() => setView('queue')}>
            Queue
          </button>
          <button className={`topbar-link${view === 'radio' ? ' active' : ''}`} onClick={() => setView('radio')}>
            Radio
          </button>
        </div>

        <div className="topbar-actions">
          <button className="topbar-action glow-btn" onClick={() => setShowOnboardingModal(true)} title="Onboarding Tour">
            <HelpCircle size={15} style={{ display: 'inline', marginRight: 4 }} />
            Tour
          </button>
          <button className="topbar-action glow-btn" onClick={() => fileInputRef.current?.click()}>
            Upload
          </button>
          <button className="topbar-action glow-btn" onClick={() => setShowAuthModal(true)}>
            <User size={15} style={{ display: 'inline', marginRight: 4 }} />
            Account
          </button>
          <button
            className="topbar-action glow-btn restart-flow-btn"
            onClick={() => setFlowStep('onboarding')}
            title="Restart Flow from Onboarding"
          >
            <LogOut size={15} style={{ display: 'inline', marginRight: 4 }} />
            Reset Flow
          </button>
        </div>
      </header>

      <div className="workspace">
        <Sidebar view={view} setView={setView} />
        <main className="content">
          {/* 3D Interactive Hero Stage */}
          <section className="hero-card card hero-3d-stage perspective-container">
            <div className="hero-3d-wrapper">
              <VinylDeck3D />
            </div>

            <div className="hero-body-3d">
              <div className="hero-label-3d">
                <span className="live-pulse-dot" /> {isPlaying ? 'NOW PLAYING' : 'AUDIO DECK READY'}
              </div>
              <h2 className="hero-title-3d">{track ? track.title : 'Your Spatial Audio Studio'}</h2>
              <p className="hero-subtitle-3d">
                {track ? `${track.artist} • ${track.album}` : 'Select a track or live radio stream to spin in 3D.'}
              </p>

              <div className="hero-actions-3d">
                <button className="hero-play-3d-btn" onClick={toggle}>
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  <span>{isPlaying ? 'Pause Deck' : 'Play Deck'}</span>
                </button>
                <button className="hero-btn-outline-3d" onClick={() => setView('aidj')}>
                  <Sparkles size={16} /> AI Studio Mode
                </button>
              </div>
            </div>
          </section>

          {view === 'library' ? <Library /> : view === 'aidj' ? <AiDj /> : view === 'queue' ? <Queue /> : <Radio />}
        </main>
      </div>
      <PlayerBar seekTo={seekTo} />

      {/* Stitch Design System Modals */}
      <OnboardingModal isOpen={showOnboardingModal} onClose={() => setShowOnboardingModal(false)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
