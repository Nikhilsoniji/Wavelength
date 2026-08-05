import { create } from 'zustand'
import { tracks } from '../data/tracks'

// This store is the single source of truth for "what should be playing."
// The actual <audio> element (in useAudioEngine) reads from and writes back
// to this store, so any component — the mini player bar, the queue, a track
// row's play button — can trigger or reflect playback without prop drilling,
// and without ever needing to remount the <audio> tag itself.

export const usePlayerStore = create((set, get) => ({
  library: tracks,
  queue: tracks.map((t) => t.id),
  currentId: tracks[0].id,
  isPlaying: false,
  currentTime: 0,
  duration: tracks[0].duration,
  volume: 0.8,
  muted: false,
  shuffle: false,
  repeat: 'off', // 'off' | 'all' | 'one'
  searchQuery: '',

  currentTrack: () => {
    const { library, currentId } = get()
    return library.find((t) => t.id === currentId) ?? library[0]
  },

  play: (id) => {
    if (id && id !== get().currentId) {
      set({ currentId: id, isPlaying: true, currentTime: 0 })
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

  setQueue: (ids) => set({ queue: ids }),

  next: () => {
    const { queue, currentId, shuffle, library } = get()
    if (shuffle) {
      const others = queue.filter((id) => id !== currentId)
      const randomId = others[Math.floor(Math.random() * others.length)] ?? currentId
      set({ currentId: randomId, currentTime: 0, isPlaying: true })
      return
    }
    const idx = queue.indexOf(currentId)
    const nextId = queue[(idx + 1) % queue.length]
    set({ currentId: nextId, currentTime: 0, isPlaying: true })
  },

  prev: () => {
    const { queue, currentId, currentTime } = get()
    // Scrubbing convention: if we're more than 3s into the track, restart it
    // instead of jumping back a track (matches most real players).
    if (currentTime > 3) {
      set({ currentTime: 0 })
      return
    }
    const idx = queue.indexOf(currentId)
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

      const uploadedTracks = savedRecords.map((rec) => {
        const { blob, ...meta } = rec
        const src = URL.createObjectURL(blob)
        return { ...meta, src, blobUrl: src, isUploaded: true }
      })

      const existingIds = new Set(uploadedTracks.map((t) => t.id))
      const defaultTracks = tracks.filter((t) => !existingIds.has(t.id))
      const combinedLibrary = [...uploadedTracks, ...defaultTracks]

      set({
        library: combinedLibrary,
        queue: combinedLibrary.map((t) => t.id),
      })
    } catch (err) {
      console.error('Failed to load saved tracks from IndexedDB:', err)
    }
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

      const newTrack = {
        ...trackMetadata,
        src: objectUrl,
        blobUrl: objectUrl,
      }

      set((state) => {
        const updatedLibrary = [newTrack, ...state.library]
        return {
          library: updatedLibrary,
          queue: updatedLibrary.map((t) => t.id),
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
        const target = state.library.find((t) => t.id === id)
        if (target && target.blobUrl) {
          URL.revokeObjectURL(target.blobUrl)
        }

        const updatedLibrary = state.library.filter((t) => t.id !== id)
        const updatedQueue = state.queue.filter((qId) => qId !== id)
        const nextCurrentId = state.currentId === id ? (updatedLibrary[0]?.id ?? null) : state.currentId

        return {
          library: updatedLibrary,
          queue: updatedQueue,
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
        const newStations = fetchedStations.filter((s) => !existingIds.has(s.id))
        if (newStations.length === 0) return {}

        const updatedLibrary = [...state.library, ...newStations]
        return {
          library: updatedLibrary,
          queue: updatedLibrary.map((t) => t.id),
        }
      })
    } catch (err) {
      console.error('Failed to load radio stations:', err)
    }
  },
})
)
