import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import AlbumArt from './AlbumArt'
import WaveformSeek from './WaveformSeek'
import TapeCounter from './TapeCounter'

export default function PlayerBar({ seekTo }) {
  const track = usePlayerStore((s) => s.currentTrack())
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const toggle = usePlayerStore((s) => s.toggle)
  const next = usePlayerStore((s) => s.next)
  const prev = usePlayerStore((s) => s.prev)
  const currentTime = usePlayerStore((s) => s.currentTime)
  const duration = usePlayerStore((s) => s.duration)
  const volume = usePlayerStore((s) => s.volume)
  const muted = usePlayerStore((s) => s.muted)
  const setVolume = usePlayerStore((s) => s.setVolume)
  const toggleMute = usePlayerStore((s) => s.toggleMute)
  const shuffle = usePlayerStore((s) => s.shuffle)
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle)
  const repeat = usePlayerStore((s) => s.repeat)
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat)

  if (!track) return null

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div className="player-bar-container">
      <div className="player-bar">
        <div className="player-left">
          <AlbumArt hue={track.hue} size={52} rounded={12} spinning={isPlaying} />
          <div className="player-trackmeta">
            <div className="player-title" title={track.title}>
              {track.title}
              <span className="hifi-badge">24-BIT</span>
            </div>
            <div className="player-artist muted">
              {track.isLive ? 'Live Stream' : `${track.artist} • ${track.album}`}
            </div>
          </div>
        </div>

        <div className="player-center">
          <div className="transport-controls">
            <IconButton
              label="Toggle shuffle"
              active={shuffle}
              onClick={toggleShuffle}
              Icon={Shuffle}
              size={18}
            />
            <IconButton label="Previous track" onClick={prev} Icon={SkipBack} size={20} />
            <button className="play-circle" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={toggle}>
              {isPlaying ? <Pause size={20} fill="#ffffff" /> : <Play size={20} fill="#ffffff" />}
            </button>
            <IconButton label="Next track" onClick={next} Icon={SkipForward} size={20} />
            <IconButton
              label="Cycle repeat mode"
              active={repeat !== 'off'}
              onClick={cycleRepeat}
              Icon={repeat === 'one' ? Repeat1 : Repeat}
              size={18}
            />
          </div>
          <div className="player-progress-row">
            <WaveformSeek trackId={track.id} currentTime={currentTime} duration={duration} isLive={track.isLive} onSeek={seekTo} />
            <TapeCounter currentTime={currentTime} duration={duration} isLive={track.isLive} />
          </div>
        </div>

        <div className="player-right">
          <button className="icon-button muted" aria-label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
            <VolumeIcon size={18} />
          </button>
          <input
            aria-label="Volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}

function IconButton({ label, onClick, Icon, size, active }) {
  return (
    <button aria-label={label} aria-pressed={active} onClick={onClick} className={`icon-button${active ? ' active' : ''}`}>
      <Icon size={size} />
    </button>
  )
}
