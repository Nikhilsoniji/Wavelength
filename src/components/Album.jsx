import { Play } from 'lucide-react'
import AlbumArt from './AlbumArt'

export default function Album({ album, onPlay }) {
  return (
    <div className="album-row card">
      <div className="album-row-content">
        <AlbumArt hue={album.hue} size={44} rounded={8} />
        <div className="album-text">
          <div className="album-name">{album.name}</div>
          <div className="album-artist">{album.artist}</div>
        </div>
      </div>

      <button
        className="album-play-button"
        aria-label={`Play album ${album.name}`}
        onClick={() => onPlay(album.trackIds)}
      >
        <Play size={14} />
      </button>
    </div>
  )
}
