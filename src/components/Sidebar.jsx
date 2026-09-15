import { Home, Search, Library as LibraryIcon, Sparkles, Radio as RadioIcon, Info } from 'lucide-react'

const navItems = [
  { id: 'library', label: 'Home', Icon: Home },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'radio', label: 'Radio', Icon: RadioIcon },
  { id: 'aidj', label: 'AI DJ', Icon: Sparkles },
  { id: 'queue', label: 'Queue', Icon: LibraryIcon },
  { id: 'about', label: 'About', Icon: Info },
]

export default function Sidebar({ view, setView }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
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

            </div>
            <span className="bottom-nav-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
