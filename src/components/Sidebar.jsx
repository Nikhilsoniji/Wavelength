import { Library as LibraryIcon, ListMusic, Disc3 } from 'lucide-react'

const items = [
  { id: 'library', label: 'Library', Icon: LibraryIcon },
  { id: 'queue', label: 'Queue', Icon: ListMusic },
]

export default function Sidebar({ view, setView }) {
  return (
    <div
      style={{
        width: 220,
        borderRight: '1px solid var(--border)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
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
    </div>
  )
}
