import { create } from 'zustand'
import { tracks, enrichTrackMetadata } from '../data/tracks.js'
import { youtubePlayer } from '../utils/youtubePlayer.js'

function buildTracksMap(list) {
  const map = new Map()
  for (let i = 0; i < list.length; i++) {
    map.set(list[i].id, list[i])
  }
  return map
}

function buildQueueMap(ids) {
  const map = new Map()
  for (let i = 0; i < ids.length; i++) {
    map.set(ids[i], i)
  }
  return map
}

const initialTracks = tracks.map(enrichTrackMetadata)
const initialQueue = initialTracks.map((t) => t.id)
const initialTracksById = buildTracksMap(initialTracks)
const initialQueueMap = buildQueueMap(initialQueue)

// This store is the single source of truth for "what should be playing."
// The actual <audio> element (in useAudioEngine) reads from and writes back
// to this store, so any component — the mini player bar, the queue, a track
// row's play button — can trigger or reflect playback without prop drilling,
// and without ever needing to remount the <audio> tag itself.

export const usePlayerStore = create((set, get) => ({
  library: initialTracks,
  tracksById: initialTracksById,
  queue: initialQueue,
  queueIndexMap: initialQueueMap,
  currentId: initialTracks[0]?.id || '',
  isPlaying: false,
  currentTime: 0,
  duration: initialTracks[0]?.duration || 180,
  volume: 0.8,
  muted: false,
  shuffle: false,
  repeat: 'off', // 'off' | 'all' | 'one'
  searchQuery: '',
  savedPlaylists: [],
  isOnline: typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
  isOfflineSimulated: false,
  offlineWarning: null,

  // Video Streaming State
  isVideoMode: false,
  videoDisplayMode: 'audio', // 'audio' | 'embedded' | 'pip' | 'fullscreen'
  videoTargetRect: null,

  setVideoDisplayMode: (mode, targetRect = null) => {
    set({
      videoDisplayMode: mode,
      isVideoMode: mode !== 'audio',
      videoTargetRect: targetRect,
    })
    youtubePlayer.setVideoMode(mode, targetRect)
  },

  toggleVideoMode: (defaultMode = 'pip') => {
    const { isVideoMode, videoDisplayMode } = get()
    if (isVideoMode) {
      set({ isVideoMode: false, videoDisplayMode: 'audio' })
      youtubePlayer.setVideoMode('audio')
    } else {
      const newMode = videoDisplayMode !== 'audio' ? videoDisplayMode : defaultMode
      set({ isVideoMode: true, videoDisplayMode: newMode })
      youtubePlayer.setVideoMode(newMode)
    }
  },

  playVideoStream: (trackOrId, initialMode = 'pip') => {
    const target = typeof trackOrId === 'object'
      ? trackOrId
      : get().tracksById.get(trackOrId) || get().library.find((t) => t.id === trackOrId)
    if (!target) return

    const enriched = enrichTrackMetadata(target)
    const { library, tracksById } = get()
    if (!tracksById.has(enriched.id)) {
      const updatedLib = [enriched, ...library]
      const updatedMap = new Map(tracksById)
      updatedMap.set(enriched.id, enriched)
      const updatedQueue = [enriched.id, ...get().queue]
      set({
        library: updatedLib,
        tracksById: updatedMap,
        queue: updatedQueue,
        queueIndexMap: buildQueueMap(updatedQueue),
      })
    }

    get().play(enriched.id)
    set({
      isVideoMode: true,
      videoDisplayMode: initialMode,
    })
    youtubePlayer.setVideoMode(initialMode)
  },

  setIsOnline: (status) => set({ isOnline: status }),
  toggleOfflineSimulation: () =>
    set((s) => ({
      isOfflineSimulated: !s.isOfflineSimulated,
      offlineWarning: null,
    })),
  dismissOfflineWarning: () => set({ offlineWarning: null }),
  isEffectiveOffline: () => !get().isOnline || get().isOfflineSimulated,

  // O(1) Instant Hash Map Lookup
  currentTrack: () => {
    const { tracksById, currentId, library } = get()
    return tracksById.get(currentId) || library[0]
  },

  play: (id) => {
    const targetId = id || get().currentId
    const targetTrack = get().tracksById.get(targetId) || get().library.find((t) => t.id === targetId)

    if (targetTrack?.isVideoStream) {
      if (!get().isVideoMode) {
        set({ isVideoMode: true, videoDisplayMode: 'pip' })
        youtubePlayer.setVideoMode('pip')
      }
    }

    // When offline, if user clicks a YouTube-only stream, fallback to offline audio
    if (get().isEffectiveOffline() && targetTrack?.isYouTube && !targetTrack.src) {
      const offlineFallback = get().library.find(
        (t) => t.isOfflineReady || t.isUploaded || t.src || t.blob
      )
      set({
        offlineWarning: {
          trackTitle: targetTrack.title,
          fallbackTitle: offlineFallback ? offlineFallback.title : 'Wavelength Horizon',
        },
      })
      if (offlineFallback) {
        set({ currentId: offlineFallback.id, isPlaying: true, currentTime: 0 })
      }
      return
    }

    set({ offlineWarning: null })
    if (targetId && targetId !== get().currentId) {
      set({ currentId: targetId, isPlaying: true, currentTime: 0 })
    } else {
      set({ isPlaying: true })
    }
  },
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  setVolume: (v) => set({ volume: v, muted: v === 0 }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  cycleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off',
    })),

  // O(1) Queue indexing
  setQueue: (ids) => set({ queue: ids, queueIndexMap: buildQueueMap(ids) }),

  next: () => {
    const { queue, queueIndexMap, currentId, shuffle } = get()
    if (shuffle) {
      const others = queue.filter((id) => id !== currentId)
      const randomId = others[Math.floor(Math.random() * others.length)] ?? currentId
      set({ currentId: randomId, currentTime: 0, isPlaying: true })
      return
    }
    const idx = queueIndexMap?.get(currentId) ?? queue.indexOf(currentId)
    const nextId = queue[(idx + 1) % queue.length]
    set({ currentId: nextId, currentTime: 0, isPlaying: true })
  },

  prev: () => {
    const { queue, queueIndexMap, currentId, currentTime } = get()
    if (currentTime > 3) {
      set({ currentTime: 0 })
      return
    }
    const idx = queueIndexMap?.get(currentId) ?? queue.indexOf(currentId)
    const prevId = queue[(idx - 1 + queue.length) % queue.length]
    set({ currentId: prevId, currentTime: 0, isPlaying: true })
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  // IndexedDB persistent storage actions
  loadSavedTracks: async () => {
    try {
      const { getUploadedTracks } = await import('../utils/db')
      const savedRecords = await getUploadedTracks()
      if (!savedRecords || savedRecords.length === 0) return

      const parsedTracks = savedRecords.map((rec) => {
        if (rec.isYouTube) {
          return { ...rec }
        }
        if (rec.blob) {
          const { blob, ...meta } = rec
          const src = URL.createObjectURL(blob)
          return { ...meta, src, blobUrl: src, isUploaded: true }
        }
        return rec
      })

      // Filter out any legacy SoundHelix demo tracks that might have been saved in old sessions
      const validSaved = parsedTracks.filter(
        (t) => !/^t[1-9]$/.test(t.id) && !t.src?.includes('SoundHelix')
      )

      const existingIds = new Set(validSaved.map((t) => t.id))
      const defaultTracks = tracks.filter((t) => !existingIds.has(t.id))
      const combinedLibrary = [...validSaved, ...defaultTracks].map(enrichTrackMetadata)
      const tracksById = buildTracksMap(combinedLibrary)
      const queue = combinedLibrary.map((t) => t.id)

      set({
        library: combinedLibrary,
        tracksById,
        queue,
        queueIndexMap: buildQueueMap(queue),
      })
    } catch (err) {
      console.error('Failed to load saved tracks from IndexedDB:', err)
    }
  },

  loadSavedPlaylists: async () => {
    try {
      const { getSavedPlaylists } = await import('../utils/db')
      const playlists = await getSavedPlaylists()
      if (!playlists || !Array.isArray(playlists)) return

      const allPlaylistTracks = []
      playlists.forEach((pl) => {
        if (Array.isArray(pl.tracks)) {
          allPlaylistTracks.push(...pl.tracks)
        }
      })

      set((state) => {
        const existingIds = new Set(state.library.map((t) => t.id))
        const newTracks = allPlaylistTracks.filter((t) => !existingIds.has(t.id)).map(enrichTrackMetadata)
        const updatedLibrary = newTracks.length > 0 ? [...newTracks, ...state.library] : state.library
        const updatedMap = newTracks.length > 0 ? buildTracksMap(updatedLibrary) : state.tracksById

        return {
          savedPlaylists: playlists,
          library: updatedLibrary,
          tracksById: updatedMap,
        }
      })
    } catch (err) {
      console.error('Failed to load saved playlists:', err)
    }
  },

  savePlaylist: async (playlist) => {
    try {
      const { savePlaylistRecord, saveYouTubeTracks } = await import('../utils/db')
      await savePlaylistRecord(playlist)
      if (playlist.tracks && playlist.tracks.length > 0) {
        await saveYouTubeTracks(playlist.tracks)
      }

      set((state) => {
        const existing = state.savedPlaylists.filter((p) => p.id !== playlist.id)
        const updatedPlaylists = [playlist, ...existing]

        const existingIds = new Set(state.library.map((t) => t.id))
        const newTracks = (playlist.tracks || []).filter((t) => !existingIds.has(t.id)).map(enrichTrackMetadata)
        const updatedLibrary = newTracks.length > 0 ? [...newTracks, ...state.library] : state.library
        const updatedMap = newTracks.length > 0 ? buildTracksMap(updatedLibrary) : state.tracksById

        return {
          savedPlaylists: updatedPlaylists,
          library: updatedLibrary,
          tracksById: updatedMap,
        }
      })
    } catch (err) {
      console.error('Failed to save playlist:', err)
    }
  },

  playPlaylist: (playlistOrId, startTrackIndex = 0) => {
    const { savedPlaylists, library, tracksById } = get()
    const targetPlaylist = typeof playlistOrId === 'object'
      ? playlistOrId
      : savedPlaylists.find((p) => p.id === playlistOrId || p.playlistId === playlistOrId)

    if (!targetPlaylist || !Array.isArray(targetPlaylist.tracks) || targetPlaylist.tracks.length === 0) {
      console.warn('Playlist not found or has no tracks:', playlistOrId)
      return
    }

    const playlistTracks = targetPlaylist.tracks.map(enrichTrackMetadata)
    const existingIds = new Set(library.map((t) => t.id))
    const missingTracks = playlistTracks.filter((t) => !existingIds.has(t.id))
    const updatedLibrary = missingTracks.length > 0 ? [...missingTracks, ...library] : library
    const updatedMap = missingTracks.length > 0 ? buildTracksMap(updatedLibrary) : tracksById

    const queue = playlistTracks.map((t) => t.id)
    const startTrack = playlistTracks[startTrackIndex] || playlistTracks[0]

    set({
      library: updatedLibrary,
      tracksById: updatedMap,
      queue,
      queueIndexMap: buildQueueMap(queue),
      currentId: startTrack.id,
      isPlaying: true,
      currentTime: 0,
    })
  },

  deletePlaylist: async (playlistId) => {
    try {
      const { deletePlaylistRecord } = await import('../utils/db')
      await deletePlaylistRecord(playlistId)

      set((state) => ({
        savedPlaylists: state.savedPlaylists.filter((p) => p.id !== playlistId && p.playlistId !== playlistId),
      }))
    } catch (err) {
      console.error('Failed to delete playlist:', err)
    }
  },

  importYouTubePlaylist: async (urlOrId, autoPlay = true) => {
    const { fetchYouTubePlaylist } = await import('../utils/youtube')
    const { saveYouTubeTracks, savePlaylistRecord } = await import('../utils/db')

    const result = await fetchYouTubePlaylist(urlOrId)
    if (!result || !result.tracks || result.tracks.length === 0) {
      throw new Error('No tracks found in this playlist.')
    }

    const enrichedTracks = result.tracks.map(enrichTrackMetadata)
    const playlistEntity = {
      id: result.id || `yt_pl_${result.playlistId || Date.now()}`,
      playlistId: result.playlistId || '',
      title: result.title || 'YouTube Playlist',
      author: result.author || 'YouTube',
      thumbnail: result.thumbnail || enrichedTracks[0]?.thumbnail || '',
      trackCount: enrichedTracks.length,
      tracks: enrichedTracks,
      savedAt: Date.now(),
      url: typeof urlOrId === 'string' ? urlOrId : '',
      isYouTube: true,
    }

    // Save tracks & playlist to IndexedDB + localStorage forever
    await saveYouTubeTracks(enrichedTracks)
    await savePlaylistRecord(playlistEntity)

    set((state) => {
      const existingIds = new Set(state.library.map((t) => t.id))
      const newTracks = enrichedTracks.filter((t) => !existingIds.has(t.id))

      const existingPlaylists = state.savedPlaylists.filter((p) => p.id !== playlistEntity.id)
      const updatedPlaylists = [playlistEntity, ...existingPlaylists]

      if (newTracks.length === 0) {
        if (autoPlay && enrichedTracks[0]) {
          const queue = enrichedTracks.map((t) => t.id)
          return {
            savedPlaylists: updatedPlaylists,
            queue,
            queueIndexMap: buildQueueMap(queue),
            currentId: enrichedTracks[0].id,
            isPlaying: true,
            currentTime: 0,
          }
        }
        return {
          savedPlaylists: updatedPlaylists,
        }
      }

      const updatedLibrary = [...newTracks, ...state.library]
      const updatedMap = buildTracksMap(updatedLibrary)
      const firstId = newTracks[0]?.id || state.currentId
      const queue = autoPlay ? enrichedTracks.map((t) => t.id) : updatedLibrary.map((t) => t.id)

      return {
        savedPlaylists: updatedPlaylists,
        library: updatedLibrary,
        tracksById: updatedMap,
        queue,
        queueIndexMap: buildQueueMap(queue),
        currentId: autoPlay ? firstId : state.currentId,
        isPlaying: autoPlay ? true : state.isPlaying,
        currentTime: autoPlay ? 0 : state.currentTime,
      }
    })

    return result
  },

  addUploadedTrack: async (file) => {
    try {
      const { saveUploadedTrack } = await import('../utils/db')
      const id = 'user_track_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
      const title = file.name.replace(/\.[^/.]+$/, '') || 'Untitled Track'

      // Get audio duration using HTML Audio element
      const tempAudio = new Audio()
      const objectUrl = URL.createObjectURL(file)
      tempAudio.src = objectUrl

      const duration = await new Promise((resolve) => {
        tempAudio.onloadedmetadata = () => resolve(Math.round(tempAudio.duration) || 180)
        tempAudio.onerror = () => resolve(180)
      })

      const trackMetadata = {
        id,
        title,
        artist: 'My Uploads',
        album: 'Local Storage',
        duration,
        hue: Math.floor(Math.random() * 360),
        isUploaded: true,
      }

      await saveUploadedTrack(trackMetadata, file)

      const newTrack = enrichTrackMetadata({
        ...trackMetadata,
        src: objectUrl,
        blobUrl: objectUrl,
      })

      set((state) => {
        const updatedLibrary = [newTrack, ...state.library]
        const updatedMap = new Map(state.tracksById)
        updatedMap.set(newTrack.id, newTrack)
        const updatedQueue = updatedLibrary.map((t) => t.id)
        return {
          library: updatedLibrary,
          tracksById: updatedMap,
          queue: updatedQueue,
          queueIndexMap: buildQueueMap(updatedQueue),
          currentId: id,
          isPlaying: true,
          currentTime: 0,
        }
      })
    } catch (err) {
      console.error('Failed to add uploaded track:', err)
    }
  },

  deleteTrack: async (id) => {
    try {
      const { deleteUploadedTrack } = await import('../utils/db')
      await deleteUploadedTrack(id)

      set((state) => {
        const target = state.tracksById.get(id) || state.library.find((t) => t.id === id)
        if (target && target.blobUrl) {
          URL.revokeObjectURL(target.blobUrl)
        }

        const updatedLibrary = state.library.filter((t) => t.id !== id)
        const updatedMap = new Map(state.tracksById)
        updatedMap.delete(id)
        const updatedQueue = state.queue.filter((qId) => qId !== id)
        const nextCurrentId = state.currentId === id ? (updatedLibrary[0]?.id ?? null) : state.currentId

        return {
          library: updatedLibrary,
          tracksById: updatedMap,
          queue: updatedQueue,
          queueIndexMap: buildQueueMap(updatedQueue),
          currentId: nextCurrentId,
          isPlaying: state.currentId === id ? false : state.isPlaying,
        }
      })
    } catch (err) {
      console.error('Failed to delete track:', err)
    }
  },

  loadRadioStations: async () => {
    try {
      const { fetchIndianRadioStations } = await import('../utils/api')
      const fetchedStations = await fetchIndianRadioStations()
      if (!fetchedStations || fetchedStations.length === 0) return

      set((state) => {
        const existingIds = new Set(state.library.map((t) => t.id))
        const newStations = fetchedStations.filter((s) => !existingIds.has(s.id)).map(enrichTrackMetadata)
        if (newStations.length === 0) return {}

        const updatedLibrary = [...state.library, ...newStations]
        const updatedMap = buildTracksMap(updatedLibrary)
        const queue = updatedLibrary.map((t) => t.id)
        return {
          library: updatedLibrary,
          tracksById: updatedMap,
          queue,
          queueIndexMap: buildQueueMap(queue),
        }
      })
    } catch (err) {
      console.error('Failed to load radio stations:', err)
    }
  },
})
)
