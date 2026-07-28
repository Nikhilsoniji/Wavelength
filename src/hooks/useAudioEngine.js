import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'

// The hardest part of a music player isn't the UI — it's making sure there's
// exactly ONE <audio> element for the whole app, that it never unmounts as
// the user navigates between views, and that playback state flows in a
// single direction: store -> audio element for commands (play/pause/seek/
// volume), and audio element -> store for facts (currentTime, duration,
// track-ended). Mixing those two directions is what causes the classic bugs
// (progress bar jumping, double-triggered next-track, etc).
//
// Call this once, at the top of <App>, so the element's lifetime matches the
// whole app's lifetime rather than any single view's.
export function useAudioEngine() {
  const audioRef = useRef(null)
  if (!audioRef.current && typeof window !== 'undefined') {
    audioRef.current = new Audio()
    audioRef.current.preload = 'metadata'
  }

  const currentTrack = usePlayerStore((s) => s.currentTrack())
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)
  const muted = usePlayerStore((s) => s.muted)
  const setTime = usePlayerStore((s) => s.setTime)
  const setDuration = usePlayerStore((s) => s.setDuration)
  const next = usePlayerStore((s) => s.next)
  const repeat = usePlayerStore((s) => s.repeat)

  // Source changed -> load the new file.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (audio.src !== currentTrack.src) {
      audio.src = currentTrack.src
      audio.load()
    }
  }, [currentTrack])

  // Play/pause commands flow from the store to the element.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay can be blocked before the first user gesture — that's
        // expected on load, so we just leave it paused rather than throw.
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack])

  // Volume/mute flow from the store to the element.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
  }, [volume, muted])

  // Facts flow from the element back to the store.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setTime(audio.currentTime)
    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration)
    }
    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0
        audio.play()
      } else {
        next()
      }
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [repeat, next, setTime, setDuration])

  const seekTo = (seconds) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = seconds
    setTime(seconds)
  }

  return { seekTo }
}
