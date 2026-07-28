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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Library
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, margin: '4px 0 0' }}>
            {library.length} tracks
          </p>
        </div>
        <SearchBar />
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
