import { Play } from 'lucide-react'
import AlbumArt from './AlbumArt'

export default function Album({ album, onPlay }) {
  return (
    <div className="album-row card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <AlbumArt hue={album.hue} size={44} rounded={6} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {album.name}
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
            {album.artist}
          </div>
        </div>
      </div>

      <div>
        <button
          aria-label={`Play album ${album.name}`}
          onClick={() => onPlay(album.trackIds)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: 'none',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <Play size={14} />
        </button>
      </div>
    </div>
  )
}
