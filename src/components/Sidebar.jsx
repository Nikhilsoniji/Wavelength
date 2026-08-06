import { Home, Search, Library as LibraryIcon, Sparkles } from 'lucide-react'

const navItems = [
  { id: 'library', label: 'Home',    Icon: Home },
  { id: 'search',  label: 'Search',  Icon: Search },
  { id: 'queue',   label: 'Library', Icon: LibraryIcon },
  { id: 'aidj',   label: 'AI DJ',   Icon: Sparkles },
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
            className={`bottom-nav-item${active ? ' active' : ''}`}
          >
            <Icon size={22} className="bottom-nav-icon" />
            <span className="bottom-nav-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
