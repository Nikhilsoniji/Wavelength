export default function AlbumArt({ hue, size = 48, spinning = false, rounded = 8 }) {
  const style = {
    width: size,
    height: size,
    borderRadius: rounded,
    background: `
      radial-gradient(circle at 30% 20%, hsl(${hue} 70% 55% / 0.9), transparent 60%),
      linear-gradient(135deg, hsl(${hue} 55% 22%), hsl(${(hue + 40) % 360} 45% 12%))
    `,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <div style={style} aria-hidden="true">
      {spinning && (
        <div
          style={{
            position: 'absolute',
            inset: '18%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #0b0a09 0 30%, transparent 32%)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
            animation: 'spin 6s linear infinite',
          }}
        />
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
