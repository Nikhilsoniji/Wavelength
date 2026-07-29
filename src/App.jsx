import { useState } from 'react'
import { useAudioEngine } from './hooks/useAudioEngine'
import Sidebar from './components/Sidebar'
import Library from './components/Library'
import Queue from './components/Queue'
import PlayerBar from './components/PlayerBar'

export default function App() {
  const [view, setView] = useState('library')
  // Calling this once, here, means the <audio> element lives for the whole
  // app's lifetime — not the lifetime of whichever view is on screen. That's
  // what makes playback "persistent" without needing a router at all: there's
  // simply no path where this component unmounts.
  const { seekTo } = useAudioEngine()

  return (
    <div className="app-shell">
      <div className="workspace">
        <Sidebar view={view} setView={setView} />
        <main className="content">
          {view === 'library' ? <Library /> : <Queue />}
        </main>
      </div>
      <PlayerBar seekTo={seekTo} />
    </div>
  )
}
