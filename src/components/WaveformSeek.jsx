import { useMemo } from 'react'
import { waveformFor } from '../data/tracks'

export default function WaveformSeek({ trackId, currentTime, duration, isLive, onSeek }) {
  const hasSeekableDuration = Number.isFinite(duration) && duration > 0
  const progress = hasSeekableDuration ? currentTime / duration : 0

  const handleClick = (e) => {
    if (!hasSeekableDuration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    onSeek(ratio * duration)
  }

  if (!hasSeekableDuration) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 38,
          color: 'var(--text-tertiary)',
          background: 'var(--bg-elevated)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 13,
        }}
      >
        {isLive ? 'Live stream' : 'No seek data available'}
      </div>
    )
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
        position: 'relative',
        height: 4,
        borderRadius: 2,
        background: 'var(--bg-active)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${Math.round(progress * 100)}%`,
          background: 'var(--accent)',
          borderRadius: 2,
          transition: 'width 200ms linear',
        }}
      />
    </div>
  )
}
