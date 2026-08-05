import { useState, useEffect, useRef } from 'react'
import { useAudioEngine } from './hooks/useAudioEngine'
import { usePlayerStore } from './store/usePlayerStore'
import Sidebar from './components/Sidebar'
import Library from './components/Library'
import Queue from './components/Queue'
import Radio from './components/Radio'
import PlayerBar from './components/PlayerBar'
import VinylDeck3D from './components/VinylDeck3D'
import Background3D from './components/Background3D'
import { Play, Pause } from 'lucide-react'

export default function App() {
  const [view, setView] = useState('library')
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
          <button className={`topbar-link${view === 'queue' ? ' active' : ''}`} onClick={() => setView('queue')}>
            Queue
          </button>
          <button className={`topbar-link${view === 'radio' ? ' active' : ''}`} onClick={() => setView('radio')}>
            Radio
          </button>
        </div>

        <div className="topbar-actions">
          <button className="topbar-action glow-btn" onClick={() => fileInputRef.current?.click()}>
            Upload
          </button>
          <button className="topbar-action glow-btn">Profile</button>
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
                <button className="hero-btn-outline-3d">3D Studio Mode</button>
              </div>
            </div>
          </section>

          {view === 'library' ? <Library /> : view === 'queue' ? <Queue /> : <Radio />}
        </main>
      </div>
      <PlayerBar seekTo={seekTo} />
    </div>
  )
}
