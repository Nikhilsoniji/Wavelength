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

let currentVideoMode = 'audio'
let currentTargetRect = null

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
      overflow: 'hidden',
      backgroundColor: '#000',
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
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 0,
        controls: 1,
        disablekb: 0,
        enablejsapi: 1,
        fs: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          isReady = true
          // Ensure iframe element scales nicely inside host container
          const iframeEl = document.querySelector('#yt-audio-host-container iframe')
          if (iframeEl) {
            iframeEl.style.width = '100%'
            iframeEl.style.height = '100%'
            iframeEl.style.display = 'block'
            iframeEl.style.border = 'none'
          }
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

  setVideoMode: (mode = 'audio', targetRect = null) => {
    currentVideoMode = mode
    currentTargetRect = targetRect
    const container = mountContainer()
    if (!container) return

    if (mode === 'audio') {
      Object.assign(container.style, {
        position: 'fixed',
        top: 'auto',
        bottom: '-9000px',
        left: '-9000px',
        right: 'auto',
        width: '200px',
        height: '200px',
        opacity: '0.001',
        pointerEvents: 'none',
        zIndex: '-99999',
        borderRadius: '0px',
        boxShadow: 'none',
        transition: 'opacity 0.2s ease',
      })
    } else if (mode === 'embedded' && targetRect) {
      Object.assign(container.style, {
        position: 'fixed',
        top: `${targetRect.top}px`,
        left: `${targetRect.left}px`,
        bottom: 'auto',
        right: 'auto',
        width: `${targetRect.width}px`,
        height: `${targetRect.height}px`,
        opacity: '1',
        pointerEvents: 'auto',
        zIndex: '9995',
        borderRadius: '16px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      })
    } else if (mode === 'pip') {
      if (targetRect) {
        Object.assign(container.style, {
          position: 'fixed',
          top: `${targetRect.top}px`,
          left: `${targetRect.left}px`,
          bottom: 'auto',
          right: 'auto',
          width: `${targetRect.width}px`,
          height: `${targetRect.height}px`,
          opacity: '1',
          pointerEvents: 'auto',
          zIndex: '9990',
          borderRadius: '12px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        })
      } else {
        Object.assign(container.style, {
          position: 'fixed',
          top: 'auto',
          left: 'auto',
          bottom: '100px',
          right: '20px',
          width: '320px',
          height: '180px',
          opacity: '1',
          pointerEvents: 'auto',
          zIndex: '9990',
          borderRadius: '12px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        })
      }
    } else if (mode === 'fullscreen') {
      Object.assign(container.style, {
        position: 'fixed',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px',
        width: '100vw',
        height: '100vh',
        opacity: '1',
        pointerEvents: 'auto',
        zIndex: '99999',
        borderRadius: '0px',
        boxShadow: 'none',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      })
    }

    const iframeEl = container.querySelector('iframe')
    if (iframeEl) {
      iframeEl.style.width = '100%'
      iframeEl.style.height = '100%'
      iframeEl.style.display = 'block'
      iframeEl.style.border = 'none'
    }
  },

  getVideoMode: () => currentVideoMode,
  getTargetRect: () => currentTargetRect,

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
