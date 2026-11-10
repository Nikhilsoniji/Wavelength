import { useEffect, useRef, useState, memo } from 'react'
import { audioVisualizer } from '../utils/audioVisualizer'
import { Activity, Radio, Disc3 } from 'lucide-react'

/**
 * AudioSpectrumVisualizer
 * High-performance, 60fps real-time audio frequency visualizer.
 * Supports multiple render modes: 'bars' (Cyber Spectrum), 'wave' (Liquid Ribbon), 'stereo' (Mirrored Pulse).
 */
function AudioSpectrumVisualizer({
  isPlaying = false,
  currentTime = 0,
  isYouTube = false,
  hue = 280,
  height = 96,
  barCount = 36,
  showControls = true,
  className = '',
}) {
  const canvasRef = useRef(null)
  const [visualMode, setVisualMode] = useState('bars') // 'bars' | 'wave' | 'stereo'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId = null
    let isSubscribed = true

    // Resize handler to match container clientWidth and DPI
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const width = rect.width || 320
      const canvasHeight = height

      canvas.width = width * dpr
      canvas.height = canvasHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Render loop
    const render = () => {
      if (!isSubscribed) return

      const rect = canvas.getBoundingClientRect()
      const width = rect.width || 320
      const h = height

      ctx.clearRect(0, 0, width, h)

      // Fetch live frequency data from visualizer engine
      const { bars, peaks, bassLevel } = audioVisualizer.getFrequencyData(
        barCount,
        isPlaying,
        currentTime,
        isYouTube
      )

      const baseHue = hue % 360
      const secondaryHue = (baseHue + 45) % 360

      if (visualMode === 'bars') {
        // --- 1. CYBER NEON BARS SPECTRUM ---
        const totalGap = 3
        const barWidth = Math.max(2, (width - (bars.length - 1) * totalGap) / bars.length)

        for (let i = 0; i < bars.length; i++) {
          const val = bars[i]
          const peakVal = peaks[i]
          const barHeight = Math.max(3, val * (h - 14))
          const x = i * (barWidth + totalGap)
          const y = h - barHeight

          // Dynamic gradient for each bar based on pitch
          const grad = ctx.createLinearGradient(0, y, 0, h)
          const barHue = (baseHue + (i / bars.length) * 40) % 360
          grad.addColorStop(0, `hsla(${barHue}, 90%, 65%, 0.95)`)
          grad.addColorStop(0.7, `hsla(${secondaryHue}, 80%, 50%, 0.75)`)
          grad.addColorStop(1, `hsla(${barHue}, 70%, 35%, 0.2)`)

          ctx.fillStyle = grad
          // Draw rounded top bar
          ctx.beginPath()
          const radius = Math.min(barWidth / 2, 4)
          ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0])
          ctx.fill()

          // Draw Peak Dot / Cap
          if (peakVal > 0.05) {
            const peakY = Math.max(2, h - peakVal * (h - 14) - 4)
            ctx.fillStyle = `hsla(${barHue}, 100%, 80%, ${Math.min(1, peakVal + 0.3)})`
            ctx.beginPath()
            ctx.arc(x + barWidth / 2, peakY, Math.min(barWidth / 2, 2.5), 0, Math.PI * 2)
            ctx.fill()
          }
        }
      } else if (visualMode === 'wave') {
        // --- 2. LIQUID WAVE OSCILLOSCOPE ---
        ctx.beginPath()
        const sliceWidth = width / (bars.length - 1)
        let x = 0

        const wavePoints = []
        for (let i = 0; i < bars.length; i++) {
          const val = bars[i]
          const y = h / 2 - (val * (h * 0.42)) * (i % 2 === 0 ? 1 : -0.85)
          wavePoints.push({ x, y: Math.max(4, Math.min(h - 4, y)) })
          x += sliceWidth
        }

        // Draw smooth Bézier curve through points
        ctx.moveTo(wavePoints[0].x, wavePoints[0].y)
        for (let i = 1; i < wavePoints.length - 1; i++) {
          const xc = (wavePoints[i].x + wavePoints[i + 1].x) / 2
          const yc = (wavePoints[i].y + wavePoints[i + 1].y) / 2
          ctx.quadraticCurveTo(wavePoints[i].x, wavePoints[i].y, xc, yc)
        }
        ctx.lineTo(width, h / 2)

        // Wave line stroke with neon glow
        ctx.strokeStyle = `hsl(${baseHue}, 90%, 65%)`
        ctx.lineWidth = 2.5
        ctx.shadowColor = `hsl(${baseHue}, 80%, 55%)`
        ctx.shadowBlur = 12
        ctx.stroke()
        ctx.shadowBlur = 0 // Reset

        // Ambient glow fill under the wave
        ctx.lineTo(width, h)
        ctx.lineTo(0, h)
        ctx.closePath()
        const waveFill = ctx.createLinearGradient(0, 0, 0, h)
        waveFill.addColorStop(0, `hsla(${baseHue}, 80%, 60%, 0.25)`)
        waveFill.addColorStop(1, `hsla(${secondaryHue}, 90%, 30%, 0.02)`)
        ctx.fillStyle = waveFill
        ctx.fill()
      } else if (visualMode === 'stereo') {
        // --- 3. STEREO MIRRORED CENTER-OUT PULSE ---
        const half = Math.floor(bars.length / 2)
        const barWidth = Math.max(2, (width / 2) / half - 2)
        const centerX = width / 2

        for (let i = 0; i < half; i++) {
          const val = bars[i]
          const barHeight = Math.max(2, val * (h * 0.85))
          const y = (h - barHeight) / 2
          const offset = i * (barWidth + 2)

          const barHue = (baseHue + i * 4) % 360
          ctx.fillStyle = `hsla(${barHue}, 85%, 60%, 0.85)`

          // Right wing
          ctx.beginPath()
          ctx.roundRect(centerX + offset, y, barWidth, barHeight, 3)
          ctx.fill()

          // Left wing (mirrored)
          ctx.beginPath()
          ctx.roundRect(centerX - offset - barWidth, y, barWidth, barHeight, 3)
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      isSubscribed = false
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isPlaying, currentTime, isYouTube, hue, height, barCount, visualMode])

  return (
    <div className={`audio-spectrum-container ${className}`}>
      <div className="spectrum-canvas-wrap" style={{ height: `${height}px` }}>
        <canvas ref={canvasRef} className="spectrum-canvas" />
      </div>

      {showControls && (
        <div className="spectrum-controls-bar">
          <div className="spectrum-live-badge">
            <span className={`live-dot ${isPlaying ? 'pulsing' : ''}`} />
            <span className="live-text">{isPlaying ? 'LIVE SPECTRUM (FFT)' : 'SPECTRUM IDLE'}</span>
          </div>

          <div className="spectrum-mode-toggles">
            <button
              type="button"
              className={`spec-mode-btn ${visualMode === 'bars' ? 'active' : ''}`}
              onClick={() => setVisualMode('bars')}
              title="Cyber Neon Bars"
              aria-label="Cyber Neon Bars"
            >
              <Activity size={13} />
              <span>Bars</span>
            </button>
            <button
              type="button"
              className={`spec-mode-btn ${visualMode === 'wave' ? 'active' : ''}`}
              onClick={() => setVisualMode('wave')}
              title="Liquid Ribbon"
              aria-label="Liquid Ribbon"
            >
              <Radio size={13} />
              <span>Wave</span>
            </button>
            <button
              type="button"
              className={`spec-mode-btn ${visualMode === 'stereo' ? 'active' : ''}`}
              onClick={() => setVisualMode('stereo')}
              title="Stereo Pulse"
              aria-label="Stereo Pulse"
            >
              <Disc3 size={13} />
              <span>Stereo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(AudioSpectrumVisualizer)

