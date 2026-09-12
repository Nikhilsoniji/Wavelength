import { useState } from 'react'

export default function AlbumArt({
  hue = 280,
  size = 48,
  spinning = false,
  rounded = 12,
  thumbnail = null,
  cover = null,
}) {
  const imageUrl = thumbnail || cover
  const [imageError, setImageError] = useState(false)

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: rounded,
    background: `
      radial-gradient(circle at 30% 30%, hsl(${hue} 70% 55% / 0.9), transparent 60%),
      linear-gradient(145deg, hsl(${hue} 50% 30%), hsl(${(hue + 40) % 360} 45% 18%))
    `,
    boxShadow: spinning
      ? `0 8px 24px -4px hsl(${hue} 60% 40% / 0.3)`
      : `0 4px 12px -3px hsl(${hue} 40% 30% / 0.2)`,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  return (
    <div style={containerStyle} aria-hidden="true" className="album-art-3d">
      {imageUrl && !imageError && (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
          }}
        />
      )}
    </div>
  )
}
