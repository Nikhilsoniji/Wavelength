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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar view={view} setView={setView} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 100px' }}>
          {view === 'library' ? <Library /> : <Queue />}
        </main>
      </div>
      <PlayerBar seekTo={seekTo} />
    </div>
  )
}
