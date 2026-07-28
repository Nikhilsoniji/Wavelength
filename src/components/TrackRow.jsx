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
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 40px 1fr 120px 56px',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        borderRadius: 8,
        background: isCurrent ? 'var(--accent-soft)' : 'transparent',
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: isCurrent ? 'var(--accent)' : 'var(--text-faint)',
          textAlign: 'center',
        }}
      >
        {index}
      </div>

      <button
        aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
        onClick={handlePlayClick}
        style={{
          width: 40,
          height: 40,
          position: 'relative',
          background: 'none',
          border: 'none',
          padding: 0,
        }}
      >
        <AlbumArt hue={track.hue} size={40} rounded={5} />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.35)',
            borderRadius: 5,
            opacity: 0,
            transition: 'opacity 120ms ease',
          }}
          className="row-play-overlay"
        >
          {isCurrentlyPlaying ? (
            <Pause size={14} color="#fff" fill="#fff" />
          ) : (
            <Play size={14} color="#fff" fill="#fff" />
          )}
        </span>
      </button>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            fontSize: 14,
            color: isCurrent ? 'var(--accent)' : 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {track.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--text-dim)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {track.artist}
        </div>
      </div>

      <div
        style={{
          fontSize: 12,
          color: 'var(--text-dim)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {track.album}
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-faint)',
          textAlign: 'right',
        }}
      >
        {formatDuration(track.duration)}
      </div>
    </div>
  )
}
