import { Search } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'

export default function SearchBar() {
  const searchQuery = usePlayerStore((s) => s.searchQuery)
  const setSearchQuery = usePlayerStore((s) => s.setSearchQuery)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '8px 12px',
        width: 260,
      }}
    >
      <Search size={15} color="var(--text-faint)" />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search title, artist, or album"
        aria-label="Search library"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text)',
          fontSize: 13,
          width: '100%',
        }}
      />
    </div>
  )
}
