export default function AlbumArt({ hue = 280, size = 48, spinning = false, rounded = 12 }) {
  const style = {
    width: size,
    height: size,
    borderRadius: rounded,
    background: `
      radial-gradient(circle at 30% 20%, hsl(${hue} 85% 60% / 0.95), transparent 65%),
      linear-gradient(135deg, hsl(${hue} 65% 25%), hsl(${(hue + 45) % 360} 55% 12%))
    `,
    boxShadow: spinning
      ? `0 10px 30px -5px hsl(${hue} 85% 50% / 0.5), inset 0 0 0 1px rgba(255,255,255,0.2)`
      : `0 6px 18px -4px hsl(${hue} 60% 40% / 0.3), inset 0 0 0 1px rgba(255,255,255,0.1)`,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: spinning ? 'scale(1.02) rotate(2deg)' : 'none',
  }

  return (
    <div style={style} aria-hidden="true" className="album-art-3d">
      {spinning && (
        <div
          style={{
            position: 'absolute',
            inset: '16%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #0b0a09 0 28%, transparent 30%)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.12)',
            animation: 'spin 5s linear infinite',
          }}
        />
      )}
    </div>
  )
}
