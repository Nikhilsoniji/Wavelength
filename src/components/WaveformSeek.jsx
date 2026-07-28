import { useMemo } from 'react'
import { waveformFor } from '../data/tracks'

export default function WaveformSeek({ trackId, currentTime, duration, onSeek }) {
  // Recomputed per track (not cached across track changes) so the "waveform"
  // shown always matches the track actually loaded.
  const bars = useMemo(() => (trackId ? waveformFor(trackId) : []), [trackId])
  const progress = duration > 0 ? currentTime / duration : 0

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    onSeek(ratio * duration)
  }

  return (
    <div
      onClick={handleClick}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(currentTime)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onSeek(Math.min(duration, currentTime + 5))
        if (e.key === 'ArrowLeft') onSeek(Math.max(0, currentTime - 5))
      }}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        height: 32,
        cursor: 'pointer',
        padding: '4px 0',
      }}
    >
      {bars.map((h, i) => {
        const played = i / bars.length < progress
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${Math.round(h * 100)}%`,
              minHeight: 2,
              borderRadius: 1,
              background: played ? 'var(--accent)' : 'var(--border)',
              transition: 'background 80ms linear',
            }}
          />
        )
      })}
    </div>
  )
}
