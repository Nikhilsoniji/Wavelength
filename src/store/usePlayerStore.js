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
}))
