/**
 * Universal Audio Frequency Analyzer & Visualizer Engine.
 * Combines real-time Web Audio API AnalyserNode (FFT) with an adaptive
 * harmonic synthesizer for cross-origin and YouTube stream playback.
 */

class AudioVisualizerEngine {
  constructor() {
    this.audioCtx = null
    this.analyser = null
    this.sourceNode = null
    this.audioElement = null
    this.frequencyData = null
    this.isConnected = false
    this.prevBars = new Float32Array(64)
    this.peakBars = new Float32Array(64)
    this.peakDecay = new Float32Array(64)
  }

  /**
   * Initializes and connects the HTML5 Audio element to Web Audio AnalyserNode.
   */
  init(audioEl) {
    if (!audioEl || typeof window === 'undefined') return
    if (this.audioElement === audioEl && this.isConnected) return

    this.audioElement = audioEl

    const setupAudioGraph = () => {
      try {
        if (!this.audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext
          if (!AudioContextClass) return
          this.audioCtx = new AudioContextClass()
        }

        if (this.audioCtx.state === 'suspended') {
          const resumeCtx = () => {
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
              this.audioCtx.resume().catch(() => {})
            }
            window.removeEventListener('click', resumeCtx)
            window.removeEventListener('keydown', resumeCtx)
            window.removeEventListener('touchstart', resumeCtx)
          }
          window.addEventListener('click', resumeCtx, { once: true })
          window.addEventListener('keydown', resumeCtx, { once: true })
          window.addEventListener('touchstart', resumeCtx, { once: true })
        }

        if (!this.analyser) {
          this.analyser = this.audioCtx.createAnalyser()
          this.analyser.fftSize = 128 // 64 frequency bins
          this.analyser.smoothingTimeConstant = 0.78
          this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount)
        }

        if (!this.sourceNode && this.audioElement) {
          try {
            this.sourceNode = this.audioCtx.createMediaElementSource(this.audioElement)
            this.sourceNode.connect(this.analyser)
            this.analyser.connect(this.audioCtx.destination)
            this.isConnected = true
          } catch (e) {
            // MediaElementAudioSourceNode already connected or cross-origin restricted
            this.isConnected = true
          }
        }
      } catch (err) {
        console.warn('Web Audio initialization note:', err)
      }
    }

    setupAudioGraph()
  }

  /**
   * Resumes AudioContext if suspended by browser autoplay policy.
   */
  resumeContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
  }

  /**
   * Retrieves real-time normalized frequency spectrum array (0.0 to 1.0)
   * with smooth physical damping and peak holding.
   *
   * @param {number} barCount Target number of visualizer bars (e.g. 32, 48, 64)
   * @param {boolean} isPlaying Whether music is currently playing
   * @param {number} currentTime Current playback timestamp in seconds
   * @param {boolean} isYouTube Whether playback is routing through YouTube iframe
   * @returns {{ bars: number[], peaks: number[], bassLevel: number, trebleLevel: number }}
   */
  getFrequencyData(barCount = 32, isPlaying = false, currentTime = 0, isYouTube = false) {
    const bins = Math.min(barCount, 64)
    const result = new Array(bins).fill(0)
    let hasRealData = false

    // 1. Try real Web Audio hardware frequency data
    if (this.analyser && this.frequencyData && isPlaying && !isYouTube) {
      try {
        this.analyser.getByteFrequencyData(this.frequencyData)
        // Check if there is actual non-zero audio signal
        let sum = 0
        for (let i = 0; i < 8; i++) {
          sum += this.frequencyData[i]
        }
        if (sum > 0) {
          hasRealData = true
          const step = Math.floor(this.frequencyData.length / bins)
          for (let i = 0; i < bins; i++) {
            const rawVal = this.frequencyData[i * step] || 0
            result[i] = rawVal / 255
          }
        }
      } catch {}
    }

    // 2. Adaptive Harmonic Synthesizer (for YouTube, radio streams, or silent fallback)
    if (!hasRealData) {
      if (isPlaying) {
        const t = (performance.now() / 1000) * 2.2
        const songTime = currentTime || t
        // 124 BPM rhythm pulse
        const beat = (songTime * 2.066) % 1
        const kickPulse = Math.pow(1 - beat, 2.5) * 0.95

        for (let i = 0; i < bins; i++) {
          const normIdx = i / bins
          // Bass frequencies (0.0 - 0.25): strong rhythmic kick and sub-bass
          if (normIdx < 0.25) {
            const bassWave = Math.sin(t * 4 + i * 0.8) * 0.25 + 0.35
            result[i] = Math.min(1, Math.max(0.12, kickPulse * 0.85 + bassWave))
          }
          // Mid frequencies (0.25 - 0.65): vocal and melody resonance
          else if (normIdx < 0.65) {
            const midWave = Math.sin(t * 6 + i * 0.6) * 0.3 + Math.cos(t * 3.5 - i * 0.4) * 0.25 + 0.45
            result[i] = Math.min(0.9, Math.max(0.1, midWave))
          }
          // Treble frequencies (0.65 - 1.0): shimmer, hi-hats, percussive transients
          else {
            const hiHat = Math.sin(t * 12 + i * 1.5) * 0.35 + 0.3
            const sparkle = ((i * 17) % 7) / 10 * 0.25
            result[i] = Math.min(0.85, Math.max(0.08, hiHat + sparkle))
          }
        }
      } else {
        // Paused: quickly fade out to zero
        for (let i = 0; i < bins; i++) {
          result[i] = 0
        }
      }
    }

    // 3. Smooth temporal inertia and peak cap calculations
    let bassSum = 0
    let trebleSum = 0
    const returnPeaks = new Array(bins).fill(0)

    for (let i = 0; i < bins; i++) {
      const target = result[i]
      const prev = this.prevBars[i] || 0
      // Attack fast, decay gracefully
      const smoothed = target > prev ? prev + (target - prev) * 0.55 : prev * 0.86
      this.prevBars[i] = smoothed
      result[i] = Number(smoothed.toFixed(3))

      // Peaks
      if (smoothed > (this.peakBars[i] || 0)) {
        this.peakBars[i] = smoothed
        this.peakDecay[i] = 0
      } else {
        this.peakDecay[i] = (this.peakDecay[i] || 0) + 0.015
        this.peakBars[i] = Math.max(0, this.peakBars[i] - this.peakDecay[i])
      }
      returnPeaks[i] = Number((this.peakBars[i] || 0).toFixed(3))

      if (i < bins * 0.3) {
        bassSum += smoothed
      } else if (i > bins * 0.7) {
        trebleSum += smoothed
      }
    }

    const bassLevel = Number((bassSum / (bins * 0.3 || 1)).toFixed(3))
    const trebleLevel = Number((trebleSum / (bins * 0.3 || 1)).toFixed(3))

    return {
      bars: result,
      peaks: returnPeaks,
      bassLevel,
      trebleLevel,
    }
  }
}

export const audioVisualizer = new AudioVisualizerEngine()

