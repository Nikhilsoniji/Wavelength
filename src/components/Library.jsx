import { useMemo, useState } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import TrackRow from './TrackRow'
import SearchBar from './SearchBar'
import { Disc3, Clock, Youtube, Play, Check } from 'lucide-react'

export default function Library({ onOpenYouTubeModal }) {
  const library = usePlayerStore((s) => s.library)
  const searchQuery = usePlayerStore((s) => s.searchQuery)
  const savedPlaylists = usePlayerStore((s) => s.savedPlaylists)
  const playPlaylist = usePlayerStore((s) => s.playPlaylist)
  const [activePlaylistFilter, setActivePlaylistFilter] = useState(null)

  const activePlaylist = savedPlaylists.find((p) => p.id === activePlaylistFilter)

  const filtered = useMemo(() => {
    let list = library
    if (activePlaylist && activePlaylist.tracks) {
      const playlistTrackIds = new Set(activePlaylist.tracks.map((t) => t.id))
      list = list.filter((t) => playlistTrackIds.has(t.id))
    }

    const q = searchQuery.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.artist?.toLowerCase().includes(q) ||
        t.album?.toLowerCase().includes(q)
    )
  }, [library, searchQuery, activePlaylist])

  return (
    <div className="library-page">
      <div className="library-header">
        <div className="library-header-main">
          <h1 className="library-title">Library</h1>
          <div className="library-meta-row">
            <p className="library-subtitle">
              {library.length} tracks
              {savedPlaylists.length > 0 && ` • ${savedPlaylists.length} saved playlist${savedPlaylists.length > 1 ? 's' : ''}`}
            </p>
            {onOpenYouTubeModal && (
              <button
                className="library-yt-btn"
                onClick={onOpenYouTubeModal}
                type="button"
                title="Import songs or playlists from YouTube"
              >
                <Youtube size={15} className="yt-icon-inline" />
                <span>Import YouTube Playlist</span>
              </button>
            )}
          </div>
        </div>
        <div className="library-search-area">
          <SearchBar />
        </div>
      </div>

      {/* Playlist Filter Chips */}
      {savedPlaylists.length > 0 && (
        <div className="library-playlist-chips-row">
          <button
            className={`lib-playlist-chip ${activePlaylistFilter === null ? 'active' : ''}`}
            onClick={() => setActivePlaylistFilter(null)}
          >
            All Tracks
          </button>
          {savedPlaylists.map((pl) => (
            <button
              key={pl.id}
              className={`lib-playlist-chip ${activePlaylistFilter === pl.id ? 'active' : ''}`}
              onClick={() => setActivePlaylistFilter(activePlaylistFilter === pl.id ? null : pl.id)}
            >
              <Youtube size={12} className="yt-icon-red" />
              <span>{pl.title}</span>
              <span className="chip-count">({pl.trackCount || pl.tracks?.length || 0})</span>
            </button>
          ))}
          {activePlaylist && (
            <button
              className="lib-playlist-playall-btn"
              onClick={() => playPlaylist(activePlaylist)}
              title="Play all tracks in this playlist"
            >
              <Play size={12} fill="currentColor" />
              <span>Play Playlist</span>
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="library-empty">
          <Disc3 size={42} className="empty-icon text-cyan" />
          <h2>No matching tracks found</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
            Nothing matches “{searchQuery}.” Try a different search term.
          </p>
        </div>
      ) : (
        <div className="library-panel">
          {/* Table Column Headers */}
          <div className="track-table-header">
            <div className="th-index">#</div>
            <div className="th-title">TITLE</div>
            <div className="th-album">ALBUM</div>
            <div className="th-actions">
              <Clock size={14} />
            </div>
          </div>

          <div className="track-list">
            {filtered.map((track, i) => (
              <div key={track.id} className="track-list-row">
                <TrackRow track={track} index={i + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
