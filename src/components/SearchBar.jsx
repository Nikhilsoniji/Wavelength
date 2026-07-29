import { Search } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'

export default function SearchBar() {
  const searchQuery = usePlayerStore((s) => s.searchQuery)
  const setSearchQuery = usePlayerStore((s) => s.setSearchQuery)

  return (
    <div className="search-bar">
      <Search size={15} color="var(--text-faint)" />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search title, artist, or album"
        aria-label="Search library"
      />
    </div>
  )
}
