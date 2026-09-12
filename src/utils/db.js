const DB_NAME = 'wavelength_db'
const DB_VERSION = 2
const STORE_NAME = 'tracks'
const PLAYLISTS_STORE = 'playlists'
const LOCAL_STORAGE_PLAYLISTS_KEY = 'wavelength_saved_playlists'

/**
 * Opens and initializes the IndexedDB database.
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(PLAYLISTS_STORE)) {
        db.createObjectStore(PLAYLISTS_STORE, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Saves a track metadata along with its audio Blob to IndexedDB.
 */
export async function saveUploadedTrack(trackMetadata, blob) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const record = { ...trackMetadata, blob }
    store.put(record)
    tx.oncomplete = () => resolve(record)
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Retrieves all uploaded tracks stored in IndexedDB.
 */
export async function getUploadedTracks() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

/**
 * Deletes a track from IndexedDB by ID.
 */
export async function deleteUploadedTrack(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Saves an array of YouTube tracks to IndexedDB.
 */
export async function saveYouTubeTracks(tracksArray) {
  if (!Array.isArray(tracksArray) || tracksArray.length === 0) return
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    tracksArray.forEach((track) => {
      store.put(track)
    })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export const deleteTrackRecord = deleteUploadedTrack

/**
 * Persists a playlist record forever into IndexedDB and localStorage backup.
 */
export async function savePlaylistRecord(playlist) {
  if (!playlist || !playlist.id) return

  // 1. Synchronous localStorage backup
  try {
    const localPlaylists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLAYLISTS_KEY) || '[]')
    const filtered = localPlaylists.filter((p) => p.id !== playlist.id)
    localStorage.setItem(LOCAL_STORAGE_PLAYLISTS_KEY, JSON.stringify([playlist, ...filtered]))
  } catch (err) {
    console.warn('localStorage playlist backup warning:', err)
  }

  // 2. Primary IndexedDB write
  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(PLAYLISTS_STORE, 'readwrite')
      const store = tx.objectStore(PLAYLISTS_STORE)
      store.put(playlist)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('IndexedDB playlist write warning:', err)
  }
}

/**
 * Retrieves all saved playlists from IndexedDB with fallback to localStorage.
 */
export async function getSavedPlaylists() {
  let idbResults = []
  try {
    const db = await openDB()
    idbResults = await new Promise((resolve, reject) => {
      const tx = db.transaction(PLAYLISTS_STORE, 'readonly')
      const store = tx.objectStore(PLAYLISTS_STORE)
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn('IndexedDB getSavedPlaylists warning:', err)
  }

  // If IndexedDB returned playlists, sync any missing to localStorage
  if (Array.isArray(idbResults) && idbResults.length > 0) {
    try {
      localStorage.setItem(LOCAL_STORAGE_PLAYLISTS_KEY, JSON.stringify(idbResults))
    } catch {}
    return idbResults
  }

  // Fallback to localStorage if IndexedDB was empty
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLAYLISTS_KEY) || '[]')
    if (Array.isArray(local) && local.length > 0) {
      // Re-seed IndexedDB in the background
      openDB().then((db) => {
        const tx = db.transaction(PLAYLISTS_STORE, 'readwrite')
        const store = tx.objectStore(PLAYLISTS_STORE)
        local.forEach((p) => store.put(p))
      }).catch(() => {})
      return local
    }
  } catch {}

  return []
}

/**
 * Removes a saved playlist from both IndexedDB and localStorage.
 */
export async function deletePlaylistRecord(id) {
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLAYLISTS_KEY) || '[]')
    const filtered = local.filter((p) => p.id !== id)
    localStorage.setItem(LOCAL_STORAGE_PLAYLISTS_KEY, JSON.stringify(filtered))
  } catch {}

  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(PLAYLISTS_STORE, 'readwrite')
      const store = tx.objectStore(PLAYLISTS_STORE)
      store.delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('IndexedDB delete playlist warning:', err)
  }
}

