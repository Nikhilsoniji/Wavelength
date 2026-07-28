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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 200px',
        alignItems: 'center',
        gap: 24,
        padding: '12px 20px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}
    >
      {/* Now playing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <AlbumArt hue={track.hue} size={48} rounded={6} spinning={isPlaying} />
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
      </div>

      {/* Transport + waveform */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            marginBottom: 6,
          }}
        >
          <IconButton
            label="Toggle shuffle"
            active={shuffle}
            onClick={toggleShuffle}
            Icon={Shuffle}
            size={16}
          />
          <IconButton label="Previous track" onClick={prev} Icon={SkipBack} size={18} />
          <button
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={toggle}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: 'none',
              background: 'var(--accent)',
              color: '#12100e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isPlaying ? <Pause size={16} fill="#12100e" /> : <Play size={16} fill="#12100e" />}
          </button>
          <IconButton label="Next track" onClick={next} Icon={SkipForward} size={18} />
          <IconButton
            label="Cycle repeat mode"
            active={repeat !== 'off'}
            onClick={cycleRepeat}
            Icon={repeat === 'one' ? Repeat1 : Repeat}
            size={16}
          />
        </div>
        <WaveformSeek
          trackId={track.id}
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
        />
        <TapeCounter currentTime={currentTime} duration={duration} />
      </div>

      {/* Volume */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifySelf: 'end' }}>
        <button
          aria-label={muted ? 'Unmute' : 'Mute'}
          onClick={toggleMute}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            display: 'flex',
          }}
        >
          <VolumeIcon size={17} />
        </button>
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ width: 100, accentColor: 'var(--accent)' }}
        />
      </div>
    </div>
  )
}

function IconButton({ label, onClick, Icon, size, active }) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        color: active ? 'var(--accent)' : 'var(--text-dim)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Icon size={size} />
    </button>
  )
}
