import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import { youtubePlayer } from '../utils/youtubePlayer'

/**
 * Hybrid Audio Engine
 * Coordinates seamless playback between native HTML5 Audio (local files, SoundHelix, live radio)
 * and the YouTube IFrame API (for YouTube tracks and playlists).
 *
 * Call this once at the top of <App>.
 */
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

  // Initialize YouTube player callbacks
  useEffect(() => {
    youtubePlayer.init({
      onEnded: () => {
        if (usePlayerStore.getState().repeat === 'one') {
          youtubePlayer.seekTo(0)
          youtubePlayer.play()
        } else {
          next()
        }
      },
      onError: (code) => {
        console.warn('YouTube playback error, advancing track. Code:', code)
        next()
      },
    })
  }, [next])

  // Track changed -> Route to correct engine
  useEffect(() => {
    const audio = audioRef.current
    if (!currentTrack) return

    if (currentTrack.isYouTube) {
      // Pause HTML5 audio if it was running
      if (audio) {
        audio.pause()
      }
      if (currentTrack.duration) {
        setDuration(currentTrack.duration)
      }
      youtubePlayer.loadVideo(currentTrack.youtubeId, isPlaying)
    } else {
      // Pause YouTube player if running
      youtubePlayer.pause()

      if (audio && currentTrack.src && audio.src !== currentTrack.src) {
        audio.src = currentTrack.src
        audio.load()
      }
    }
  }, [currentTrack?.id])

  // Play / Pause command dispatch
  useEffect(() => {
    const audio = audioRef.current
    if (!currentTrack) return

    if (currentTrack.isYouTube) {
      if (audio) audio.pause()
      if (isPlaying) {
        youtubePlayer.play()
      } else {
        youtubePlayer.pause()
      }
    } else {
      youtubePlayer.pause()
      if (audio) {
        if (isPlaying) {
          audio.play().catch(() => {
            // Autoplay prevention fallback
          })
        } else {
          audio.pause()
        }
      }
    }
  }, [isPlaying, currentTrack?.id])

  // Volume & Mute synchronization across both engines
  useEffect(() => {
    const audio = audioRef.current
    const effectiveVolume = muted ? 0 : volume

    if (audio) {
      audio.volume = effectiveVolume
    }
    youtubePlayer.setVolume(effectiveVolume)
    youtubePlayer.setMuted(muted)
  }, [volume, muted])

  // HTML5 audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      if (!currentTrack?.isYouTube) {
        setTime(audio.currentTime)
      }
    }
    const onLoadedMetadata = () => {
      if (!currentTrack?.isYouTube && Number.isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }
    const onEnded = () => {
      if (!currentTrack?.isYouTube) {
        if (repeat === 'one') {
          audio.currentTime = 0
          audio.play().catch(() => {})
        } else {
          next()
        }
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
  }, [currentTrack?.isYouTube, repeat, next, setTime, setDuration])

  // YouTube audio polling heartbeat (for accurate currentTime & duration)
  useEffect(() => {
    if (!currentTrack?.isYouTube || !isPlaying) return

    const timer = setInterval(() => {
      const cur = youtubePlayer.getCurrentTime()
      const dur = youtubePlayer.getDuration()
      if (Number.isFinite(cur) && cur >= 0) {
        setTime(cur)
      }
      if (Number.isFinite(dur) && dur > 0) {
        setDuration(dur)
      }
    }, 250)

    return () => clearInterval(timer)
  }, [currentTrack?.isYouTube, isPlaying, setTime, setDuration])

  const seekTo = (seconds) => {
    if (currentTrack?.isYouTube) {
      youtubePlayer.seekTo(seconds)
      setTime(seconds)
    } else {
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = seconds
        setTime(seconds)
      }
    }
  }

  return { seekTo }
}
