import { useState, memo } from 'react'
import { Play, Pause, Trash2, Heart, Download, Mic2 } from 'lucide-react'
import AlbumArt from './AlbumArt'
import { usePlayerStore } from '../store/usePlayerStore'
import { getFormattedDuration } from '../data/tracks'

function TrackRow({ track, index, dragHandleProps, style }) {
  // O(1) Boolean selectors: only re-renders the specific row whose active status changes!
  const isCurrent = usePlayerStore((s) => s.currentId === track.id)
  const isCurrentlyPlaying = usePlayerStore((s) => s.currentId === track.id && s.isPlaying)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)
  const deleteTrack = usePlayerStore((s) => s.deleteTrack)
  const setIsLyricsOpen = usePlayerStore((s) => s.setIsLyricsOpen)
  const [liked, setLiked] = useState(false)

  const handlePlayClick = (e) => {
    e.stopPropagation()
    if (isCurrent) toggle()
    else play(track.id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${track.title}" from your library?`)) {
      deleteTrack(track.id)
    }
  }

  // O(1) property read with fast fallback
  const durationDisplay =
    track.formattedDuration ||
    (track.isLive ? 'LIVE' : getFormattedDuration(track.duration, track.isLive))

  return (
    <div
      {...(dragHandleProps ?? {})}
      className={`track-row${isCurrent ? ' current' : ''}`}
      style={style}
      onClick={handlePlayClick}
    >
      <div className="track-index">
        {isCurrentlyPlaying ? (
          <div className="audio-eq-icon">
            <span className="eq-bar" />
            <span className="eq-bar" />
            <span className="eq-bar" />
          </div>
        ) : (
          index
        )}
      </div>

      <div className="track-play-btn">
        <AlbumArt
          hue={track.hue}
          thumbnail={track.thumbnail || track.cover}
          size={40}
          rounded={8}
        />
        <span className="row-play-overlay">
          {isCurrentlyPlaying ? (
            <Pause size={16} color="#fff" fill="#fff" />
          ) : (
            <Play size={16} color="#fff" fill="#fff" />
          )}
        </span>
      </div>

      <div className="track-meta">
        <div className="track-title">
          {track.title}
          {track.isVideoStream && <span className="track-yt-badge">Video Stream</span>}
          {track.isOfflineReady && <span className="track-offline-badge">Offline Ready</span>}
          {track.isUploaded && <span className="track-uploaded-badge">Offline File</span>}
          {track.isYouTube && !track.isVideoStream && <span className="track-yt-badge">YouTube</span>}
        </div>
        <div className="track-artist">
          {track.artist}
          {track.isLive ? <span className="track-live-badge">LIVE</span> : null}
        </div>
      </div>

      <div className="track-album">{track.album}</div>

      <div className="track-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          className="track-action-btn track-lyrics-btn"
          onClick={(e) => {
            e.stopPropagation()
            if (!isCurrent) play(track.id)
            setIsLyricsOpen(true)
          }}
          title="View Synchronized Lyrics"
        >
          <Mic2 size={15} />
        </button>

        <button
          className={`track-action-btn ${liked ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            setLiked(!liked)
          }}
          title={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={15} fill={liked ? 'var(--accent)' : 'none'} color={liked ? 'var(--accent)' : 'currentColor'} />
        </button>

        {track.src && !track.isYouTube && (
          <a
            className="track-action-btn"
            href={track.src}
            download={track.title || 'track'}
            title="Download track"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={15} />
          </a>
        )}

        <div className="track-duration">{durationDisplay}</div>

        {(track.isUploaded || track.isYouTube) && (
          <button
            className="track-action-btn track-delete-btn"
            title="Delete from library"
            onClick={handleDelete}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  )
}

export default memo(TrackRow)

