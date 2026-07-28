function format(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function TapeCounter({ currentTime, duration }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-faint)',
        letterSpacing: 0.5,
        marginTop: 4,
      }}
    >
      <span style={{ color: 'var(--text-dim)' }}>{format(currentTime)}</span>
      <span>{format(duration)}</span>
    </div>
  )
}
