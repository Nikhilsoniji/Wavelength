import { Play, Pause, Radio } from 'lucide-react'
import { useMemo } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import AlbumArt from './AlbumArt'

export default function RadioPage() {
  const library = usePlayerStore((s) => s.library)
  const currentId = usePlayerStore((s) => s.currentId)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)

  const stations = useMemo(
    () => library.filter((track) => track.isLive),
    [library]
  )

  if (stations.length === 0) {
    return (
      <div className="radio-page card">
        <div className="radio-empty">
          <Radio size={36} />
          <h2>No live stations found</h2>
          <p>Configure a station in your track library to stream live audio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="radio-page">
      <div className="radio-header">
        <div>
          <h1>Live Radio</h1>
          <p className="muted">Stream Bollywood radio directly in the app.</p>
        </div>
      </div>

      <div className="radio-grid">
        {stations.map((station) => {
          const isCurrent = station.id === currentId
          const isCurrentlyPlaying = isCurrent && isPlaying

          return (
            <div key={station.id} className="radio-card card">
              <div className="radio-card-top">
                <AlbumArt hue={station.hue} size={84} rounded={18} spinning={isCurrentlyPlaying} />
                <div className="radio-meta">
                  <div className="radio-title">{station.title}</div>
                  <div className="radio-subtitle">{station.artist}</div>
                  <div className="radio-album muted">{station.album}</div>
                </div>
              </div>

              <div className="radio-actions">
                <button
                  className="hero-btn"
                  onClick={() => (isCurrent ? toggle() : play(station.id))}
                >
                  {isCurrentlyPlaying ? <Pause size={16} /> : <Play size={16} />} 
                  {isCurrentlyPlaying ? 'Pause stream' : 'Listen live'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
