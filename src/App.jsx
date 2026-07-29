import { useState } from 'react'
import { useAudioEngine } from './hooks/useAudioEngine'
import { usePlayerStore } from './store/usePlayerStore'
import Sidebar from './components/Sidebar'
import AlbumArt from './components/AlbumArt'
import Library from './components/Library'
import Queue from './components/Queue'
import Radio from './components/Radio'
import PlayerBar from './components/PlayerBar'

export default function App() {
  const [view, setView] = useState('library')
  const { seekTo } = useAudioEngine()
  const track = usePlayerStore((s) => s.currentTrack())
  const isPlaying = usePlayerStore((s) => s.isPlaying)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo">W</div>
          <div>
            <div className="topbar-title">Wavelength</div>
            <div className="topbar-subtitle">Music</div>
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
          <button className="topbar-action">Upload</button>
          <button className="topbar-action">Profile</button>
        </div>
      </header>

      <div className="workspace">
        <Sidebar view={view} setView={setView} />
        <main className="content">
          <section className="hero-card card">
            <div className="hero-left">
              <AlbumArt hue={track?.hue ?? 320} size={148} rounded={24} spinning={isPlaying} />
            </div>
            <div className="hero-body">
              <div className="hero-label">Now playing</div>
              <h2>{track ? track.title : 'Your music, your mood'}</h2>
              <p>{track ? `${track.artist} • ${track.album}` : 'Browse your collection or queue a track to get started.'}</p>
            </div>
            <div className="hero-actions">
              <button className="hero-btn">Favorite</button>
              <button className="hero-btn outline">Share</button>
            </div>
          </section>

          {view === 'library' ? <Library /> : view === 'queue' ? <Queue /> : <Radio />}
        </main>
      </div>
      <PlayerBar seekTo={seekTo} />
    </div>
  )
}
