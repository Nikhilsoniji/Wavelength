import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, Volume1, VolumeX, Download,
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import AlbumArt from './AlbumArt'
import WaveformSeek from './WaveformSeek'

function fmt(s) {
  if (!s || !Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sc = Math.floor(s % 60)
  return `${m}:${String(sc).padStart(2, '0')}`
}

export default function PlayerBar({ seekTo }) {
  const track      = usePlayerStore((s) => s.currentTrack())
  const isPlaying  = usePlayerStore((s) => s.isPlaying)
  const toggle     = usePlayerStore((s) => s.toggle)
  const next       = usePlayerStore((s) => s.next)
  const prev       = usePlayerStore((s) => s.prev)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration   = usePlayerStore((s) => s.duration)
  const volume     = usePlayerStore((s) => s.volume)
  const muted      = usePlayerStore((s) => s.muted)
  const setVolume  = usePlayerStore((s) => s.setVolume)
  const toggleMute = usePlayerStore((s) => s.toggleMute)

  if (!track) return null

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div className="stitch-player-bar">
      <div className="spb-inner glass-card">
        {/* Album art */}
        <div className="spb-art">
          <AlbumArt hue={track.hue} size={44} rounded={10} spinning={isPlaying} />
        </div>

        {/* Track info */}
        <div className="spb-meta">
          <div className="spb-title">{track.title}</div>
          <div className="spb-artist">
            {track.isLive ? 'Live Stream' : `${track.artist} • ${track.album}`}
          </div>
        </div>

        {/* Progress */}
        <div className="spb-progress">
          <WaveformSeek
            trackId={track.id}
            currentTime={currentTime}
            duration={duration}
            isLive={track.isLive}
            onSeek={seekTo}
          />
          <div className="spb-times">
            <span>{fmt(currentTime)}</span>
            <span>{track.isLive ? 'LIVE' : fmt(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="spb-controls">
          <button className="spb-btn" aria-label="Previous" onClick={prev}>
            <SkipBack size={18} />
          </button>
          <button className="spb-play-btn" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={toggle}>
            {isPlaying
              ? <Pause size={20} fill="#fff" />
              : <Play size={20} fill="#fff" />
            }
          </button>
          <button className="spb-btn" aria-label="Next" onClick={next}>
            <SkipForward size={18} />
          </button>
        </div>

        {/* Volume + Download */}
        <div className="spb-right">
          {track.src && (
            <a
              className="spb-btn"
              href={track.src}
              download={track.title || 'track'}
              title="Download"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={16} />
            </a>
          )}
          <button className="spb-btn" aria-label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
            <VolumeIcon size={16} />
          </button>
          <input
            className="spb-volume"
            aria-label="Volume"
            type="range"
            min={0} max={1} step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
