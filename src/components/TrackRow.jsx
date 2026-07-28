import { Play, Pause } from 'lucide-react'
import AlbumArt from './AlbumArt'
import { usePlayerStore } from '../store/usePlayerStore'

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function TrackRow({ track, index, dragHandleProps, style }) {
  const currentId = usePlayerStore((s) => s.currentId)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)

  const isCurrent = track.id === currentId
  const isCurrentlyPlaying = isCurrent && isPlaying

  const handlePlayClick = () => {
    if (isCurrent) toggle()
    else play(track.id)
  }

  return (
    <div
      {...(dragHandleProps ?? {})}
      className={`track-row${isCurrent ? ' current' : ''}`}
      style={style}
    >
      <div className="track-index">{index}</div>

      <button
        className="track-play-btn"
        aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
        onClick={handlePlayClick}
      >
        <AlbumArt hue={track.hue} size={40} rounded={5} />
        <span className="row-play-overlay">
          {isCurrentlyPlaying ? (
            <Pause size={14} color="#fff" fill="#fff" />
          ) : (
            <Play size={14} color="#fff" fill="#fff" />
          )}
        </span>
      </button>

      <div className="track-meta">
        <div className="track-title">{track.title}</div>
        <div className="track-artist">{track.artist}</div>
      </div>

      <div className="track-album">{track.album}</div>

      <div className="track-duration">{formatDuration(track.duration)}</div>
    </div>
  )
}
