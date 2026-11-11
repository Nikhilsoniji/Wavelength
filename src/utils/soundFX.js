// src/utils/soundFX.js
// High-performance real-time Web Audio API sound generator for DJ Launchpad
// Zero external asset dependencies - instant response, zero latency, works offline

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export function playSoundEffect(type) {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  switch (type) {
    case 'kick': {
      // 808 Deep Sub Kick
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.35)

      gain.gain.setValueAtTime(1.0, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.4)
      break
    }

    case 'snare': {
      // Trap Snare + Tone Burst
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1
      }
      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.setValueAtTime(1000, now)

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.8, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

      whiteNoise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(ctx.destination)

      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1)
      oscGain.gain.setValueAtTime(0.5, now)
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

      osc.connect(oscGain)
      oscGain.connect(ctx.destination)

      whiteNoise.start(now)
      osc.start(now)
      whiteNoise.stop(now + 0.22)
      osc.stop(now + 0.12)
      break
    }

    case 'hihat': {
      // Crisp 16th Hi-Hat Roll
      const count = 3
      const step = 0.05
      for (let s = 0; s < count; s++) {
        const t = now + s * step
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
          data[i] = Math.random() * 2 - 1
        }
        const src = ctx.createBufferSource()
        src.buffer = buffer
        const filter = ctx.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.setValueAtTime(8000, t)

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.4 * (1 - s * 0.2), t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)

        src.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        src.start(t)
        src.stop(t + 0.045)
      }
      break
    }

    case 'siren': {
      // EDM Synth Drop Riser / Siren
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(350, now)
      osc.frequency.linearRampToValueAtTime(950, now + 0.5)

      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.58)
      break
    }

    case 'airhorn': {
      // Reggae / DJ Stadium Airhorn Burst
      const freqs = [466.16, 554.37, 622.25] // Bb chord
      freqs.forEach((f) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(f, now)

        gain.gain.setValueAtTime(0.2, now)
        gain.gain.setValueAtTime(0.25, now + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.38)
      })
      break
    }

    case 'bassdrop': {
      // Sub Bass Downlifter
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(95, now)
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.8)

      gain.gain.setValueAtTime(0.85, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.9)
      break
    }

    case 'cosmic': {
      // Cosmic Synth Arp Chime
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.08
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, noteTime)

        gain.gain.setValueAtTime(0.3, noteTime)
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(noteTime)
        osc.stop(noteTime + 0.35)
      })
      break
    }

    case 'glitch': {
      // Glitch / Cyber Impact
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(240, now)
      osc.frequency.setValueAtTime(70, now + 0.05)
      osc.frequency.setValueAtTime(190, now + 0.1)
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3)

      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.38)
      break
    }

    default:
      break
  }
}
