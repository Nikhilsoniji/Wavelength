import { useMemo } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import TrackRow from './TrackRow'
import SearchBar from './SearchBar'

export default function Library() {
  const library = usePlayerStore((s) => s.library)
  const searchQuery = usePlayerStore((s) => s.searchQuery)

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return library
    return library.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    )
  }, [library, searchQuery])

  return (
    <div>
      <div className="library-header">
        <div>
          <h1>Library</h1>
          <p className="muted">{library.length} tracks</p>
        </div>
        <div>
          <SearchBar />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>
          Nothing matches “{searchQuery}.” Try a different title, artist, or album.
        </p>
      ) : (
        <div>
          {filtered.map((track, i) => (
            <div key={track.id} className="track-list-row" style={{ borderRadius: 8 }}>
              <TrackRow track={track} index={i + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
