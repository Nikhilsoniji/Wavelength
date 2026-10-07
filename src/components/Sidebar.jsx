import { Home, Search, Library as LibraryIcon, Sparkles, Radio as RadioIcon, Info, Mic2, Youtube } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'

const navItems = [
  { id: 'library', label: 'Home', Icon: Home },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'ytmusic', label: 'YT Music', Icon: Youtube },
  { id: 'radio', label: 'Radio', Icon: RadioIcon },
  { id: 'aidj', label: 'AI DJ', Icon: Sparkles },
  { id: 'queue', label: 'Queue', Icon: LibraryIcon },
  { id: 'about', label: 'About', Icon: Info },
]

export default function Sidebar({ view, setView }) {
  const isLyricsOpen = usePlayerStore((s) => s.isLyricsOpen)
  const toggleLyrics = usePlayerStore((s) => s.toggleLyrics)

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav-inner">
        {navItems.map(({ id, label, Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              aria-current={active ? 'page' : undefined}
              className={`bottom-nav-item ${active ? 'active' : ''}`}
            >
              <div className="nav-icon-container">
                <Icon size={20} className="bottom-nav-icon" />
                {active && <span className="nav-active-glow" />}
              </div>
              <span className="bottom-nav-label">{label}</span>
            </button>
          )
        })}

        <div className="nav-divider" />

        <button
          onClick={toggleLyrics}
          className={`bottom-nav-item nav-lyrics-item ${isLyricsOpen ? 'active' : ''}`}
          title="Open Synchronized Lyrics"
          aria-label="Open Synchronized Lyrics"
        >
          <div className="nav-icon-container">
            <Mic2 size={20} className="bottom-nav-icon" />
            {isLyricsOpen && <span className="nav-active-glow" />}
          </div>
          <span className="bottom-nav-label">Lyrics</span>
        </button>
      </div>
    </nav>
  )
}
