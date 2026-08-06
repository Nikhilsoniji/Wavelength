import { useMemo } from 'react'
import { Library as LibraryIcon, ListMusic, Disc3, Radio, Sparkles, Heart } from 'lucide-react'
import Album from './Album'
import { usePlayerStore } from '../store/usePlayerStore'

const items = [
  { id: 'library', label: 'Library', Icon: LibraryIcon },
  { id: 'aidj', label: 'AI DJ', Icon: Sparkles },
  { id: 'queue', label: 'Queue', Icon: ListMusic },
  { id: 'radio', label: 'Live Radio', Icon: Radio },
]

export default function Sidebar({ view, setView }) {
  const library = usePlayerStore((s) => s.library)
  const setQueue = usePlayerStore((s) => s.setQueue)
  const play = usePlayerStore((s) => s.play)

  const albums = useMemo(() => {
    const m = new Map()
    for (const t of library) {
      const key = t.album ?? 'Unknown'
      if (!m.has(key)) m.set(key, { name: key, artist: t.artist, hue: t.hue, trackIds: [] })
      m.get(key).trackIds.push(t.id)
    }
    return Array.from(m.values())
  }, [library])

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Disc3 size={24} color="#ff4d57" className="spinning-logo" />
        <span className="sidebar-title">Wavelength</span>
        <span className="sidebar-badge">PRO</span>
      </div>

      <nav className="nav-list">
        {items.map(({ id, label, Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              aria-current={active ? 'page' : undefined}
              className={`nav-item${active ? ' active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && <span className="nav-active-indicator" />}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-hifi-widget card">
        <div className="hifi-widget-header">
          <Sparkles size={14} color="#4fd1c5" />
          <span>Spatial Audio Engine</span>
        </div>
        <p className="hifi-widget-text">24-Bit / 192kHz Master Audio Active</p>
      </div>

      <div className="album-section">
        <h3>Albums & Collections</h3>
        <div className="album-list">
          {albums.map((a) => (
            <div key={a.name} className="album-list-item">
              <Album
                album={a}
                onPlay={(ids) => {
                  setQueue(ids)
                  play(ids[0])
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
