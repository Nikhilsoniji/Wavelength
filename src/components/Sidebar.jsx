import { useMemo } from 'react'
import { Library as LibraryIcon, ListMusic, Disc3 } from 'lucide-react'
import Album from './Album'
import { usePlayerStore } from '../store/usePlayerStore'

const items = [
  { id: 'library', label: 'Library', Icon: LibraryIcon },
  { id: 'queue', label: 'Queue', Icon: ListMusic },
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
    <div className="sidebar" style={{ width: 240, padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px' }}>
        <Disc3 size={20} color="var(--accent)" />
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: 0.2,
          }}
        >
          Wavelength
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(({ id, label, Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 8,
                border: 'none',
                background: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-dim)',
                fontSize: 14,
                fontWeight: 500,
                textAlign: 'left',
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </nav>

      <div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 700,
            margin: '6px 8px',
            color: 'var(--text-dim)',
          }}
        >
          Albums
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {albums.map((a) => (
            <div key={a.name} style={{ padding: '0 4px' }}>
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
