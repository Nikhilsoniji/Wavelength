/**
 * YouTube IFrame Player API Singleton Manager
 * Handles script injection, player mounting, audio playback synchronization,
 * and unified controls without user-facing video interruption.
 */

let player = null
let isReady = false
let isScriptLoading = false
let pendingVideoId = null
let pendingPlay = false
let currentVideoId = null
let callbacks = {
  onReady: null,
  onEnded: null,
  onPlaying: null,
  onPaused: null,
  onError: null,
}

function injectYouTubeScript() {
  if (typeof window === 'undefined') return
  if (window.YT && window.YT.Player) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    if (isScriptLoading) {
      const checkInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
      return
    }

    isScriptLoading = true
    const existingTag = document.getElementById('yt-iframe-api-script')
    if (!existingTag) {
      const tag = document.createElement('script')
      tag.id = 'yt-iframe-api-script'
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      } else {
        document.head.appendChild(tag)
      }
    }

    const prevReady = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === 'function') prevReady()
      resolve()
    }
  })
}

function mountContainer() {
  if (typeof document === 'undefined') return null
  let container = document.getElementById('yt-audio-host-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'yt-audio-host-container'
    // Off-screen but non-zero size to prevent browsers from throttling audio playback
    Object.assign(container.style, {
      position: 'fixed',
      bottom: '-9000px',
      left: '-9000px',
      width: '200px',
      height: '200px',
      opacity: '0.001',
      pointerEvents: 'none',
      zIndex: '-99999',
    })
    const playerTarget = document.createElement('div')
    playerTarget.id = 'yt-player-iframe'
    container.appendChild(playerTarget)
    document.body.appendChild(container)
  }
  return container
}

export const youtubePlayer = {
  init: async (cbs = {}) => {
    callbacks = { ...callbacks, ...cbs }
    if (typeof window === 'undefined') return

    mountContainer()
    await injectYouTubeScript()

    if (player) {
      if (callbacks.onReady && isReady) callbacks.onReady()
      return
    }

    player = new window.YT.Player('yt-player-iframe', {
      height: '200',
      width: '200',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          isReady = true
          if (callbacks.onReady) callbacks.onReady()
          if (pendingVideoId) {
            youtubePlayer.loadVideo(pendingVideoId, pendingPlay)
            pendingVideoId = null
          }
        },
        onStateChange: (e) => {
          if (!window.YT) return
          if (e.data === window.YT.PlayerState.ENDED) {
            callbacks.onEnded?.()
          } else if (e.data === window.YT.PlayerState.PLAYING) {
            callbacks.onPlaying?.()
          } else if (e.data === window.YT.PlayerState.PAUSED) {
            callbacks.onPaused?.()
          }
        },
        onError: (e) => {
          console.warn('YouTube Player Event Error:', e.data)
          callbacks.onError?.(e.data)
        },
      },
    })
  },

  loadVideo: (videoId, autoPlay = true) => {
    currentVideoId = videoId
    if (!isReady || !player || !player.loadVideoById) {
      pendingVideoId = videoId
      pendingPlay = autoPlay
      youtubePlayer.init()
      return
    }

    try {
      if (autoPlay) {
        player.loadVideoById(videoId)
      } else {
        player.cueVideoById(videoId)
      }
    } catch (err) {
      console.warn('Error loading video on YouTube player:', err)
    }
  },

  play: () => {
    if (isReady && player && typeof player.playVideo === 'function') {
      try {
        player.playVideo()
      } catch (err) {
        console.warn('Error calling playVideo:', err)
      }
    }
  },

  pause: () => {
    if (isReady && player && typeof player.pauseVideo === 'function') {
      try {
        player.pauseVideo()
      } catch (err) {
        console.warn('Error calling pauseVideo:', err)
      }
    }
  },

  seekTo: (seconds) => {
    if (isReady && player && typeof player.seekTo === 'function') {
      try {
        player.seekTo(seconds, true)
      } catch (err) {
        console.warn('Error seeking YouTube video:', err)
      }
    }
  },

  setVolume: (fraction) => {
    if (isReady && player && typeof player.setVolume === 'function') {
      try {
        const vol = Math.max(0, Math.min(100, Math.round(fraction * 100)))
        player.setVolume(vol)
      } catch (err) {
        console.warn('Error setting YouTube volume:', err)
      }
    }
  },

  setMuted: (muted) => {
    if (isReady && player) {
      try {
        if (muted && typeof player.mute === 'function') player.mute()
        if (!muted && typeof player.unMute === 'function') player.unMute()
      } catch (err) {
        console.warn('Error setting mute state on YouTube player:', err)
      }
    }
  },

  getCurrentTime: () => {
    if (isReady && player && typeof player.getCurrentTime === 'function') {
      try {
        return player.getCurrentTime() || 0
      } catch {
        return 0
      }
    }
    return 0
  },

  getDuration: () => {
    if (isReady && player && typeof player.getDuration === 'function') {
      try {
        return player.getDuration() || 0
      } catch {
        return 0
      }
    }
    return 0
  },

  getCurrentVideoId: () => currentVideoId,
  isReady: () => isReady,
}
