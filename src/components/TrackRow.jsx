import { useState } from 'react'
import { Play, Pause, Trash2, Heart } from 'lucide-react'
import AlbumArt from './AlbumArt'
import { usePlayerStore } from '../store/usePlayerStore'

function formatDuration(seconds) {
  if (!seconds || !Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function TrackRow({ track, index, dragHandleProps, style }) {
  const currentId = usePlayerStore((s) => s.currentId)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)
  const deleteTrack = usePlayerStore((s) => s.deleteTrack)
  const [liked, setLiked] = useState(false)

  const isCurrent = track.id === currentId
  const isCurrentlyPlaying = isCurrent && isPlaying

  const handlePlayClick = () => {
    if (isCurrent) toggle()
    else play(track.id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${track.title}" from local storage?`)) {
      deleteTrack(track.id)
    }
  }

  return (
    <div
      {...(dragHandleProps ?? {})}
      className={`track-row${isCurrent ? ' current' : ''}`}
      style={style}
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

      <button
        className="track-play-btn"
        aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
        onClick={handlePlayClick}
      >
        <AlbumArt hue={track.hue} size={42} rounded={8} spinning={isCurrentlyPlaying} />
        <span className="row-play-overlay">
          {isCurrentlyPlaying ? (
            <Pause size={16} color="#fff" fill="#fff" />
          ) : (
            <Play size={16} color="#fff" fill="#fff" />
          )}
        </span>
      </button>

      <div className="track-meta">
        <div className="track-title">
          {track.title}
          {track.isUploaded && <span className="track-uploaded-badge">Uploaded</span>}
        </div>
        <div className="track-artist">
          {track.artist}
          {track.isLive ? <span className="track-live-badge">LIVE</span> : null}
        </div>
      </div>

      <div className="track-album">{track.album}</div>

      <div className="track-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className={`track-action-btn ${liked ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          title={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={15} fill={liked ? '#ff4d57' : 'none'} color={liked ? '#ff4d57' : 'currentColor'} />
        </button>

        <div className="track-duration">{track.isLive ? 'Live' : formatDuration(track.duration)}</div>

        {track.isUploaded && (
          <button
            className="track-action-btn track-delete-btn"
            title="Delete uploaded track"
            onClick={handleDelete}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
