const DB_NAME = 'wavelength_db'
const DB_VERSION = 3
const STORE_NAME = 'tracks'
const PLAYLISTS_STORE = 'playlists'
const USERS_STORE = 'users'
const LOCAL_STORAGE_PLAYLISTS_KEY = 'wavelength_saved_playlists'
const LOCAL_STORAGE_USERS_KEY = 'wavelength_saved_users'

/**
 * Opens and initializes the IndexedDB database.
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this environment'))
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(PLAYLISTS_STORE)) {
        db.createObjectStore(PLAYLISTS_STORE, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        const usersStore = db.createObjectStore(USERS_STORE, { keyPath: 'id' })
        usersStore.createIndex('email', 'email', { unique: true })
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
    if (typeof indexedDB === 'undefined') return user
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

/* =====================================================================
   LOCAL USER DATABASE (IndexedDB + localStorage backup)
   ===================================================================== */

/**
 * Saves or updates a user record in the local database.
 */
export async function saveUserRecord(user) {
  if (!user || !user.id) return null

  // 1. Sync to localStorage backup
  try {
    const localUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]')
    const filtered = localUsers.filter((u) => u.id !== user.id && u.email !== user.email)
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify([user, ...filtered]))
  } catch (err) {
    console.warn('localStorage user backup warning:', err)
  }

  // 2. Primary IndexedDB write
  try {
    if (typeof indexedDB === 'undefined') return
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(USERS_STORE, 'readwrite')
      const store = tx.objectStore(USERS_STORE)
      store.put(user)
      tx.oncomplete = () => resolve(user)
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('IndexedDB saveUserRecord warning:', err)
  }

  return user
}

/**
 * Retrieves a user by their unique user ID.
 */
export async function getUserById(id) {
  if (!id) return null
  try {
    if (typeof indexedDB === 'undefined') throw new Error('no idb')
    const db = await openDB()
    const record = await new Promise((resolve) => {
      const tx = db.transaction(USERS_STORE, 'readonly')
      const store = tx.objectStore(USERS_STORE)
      const req = store.get(id)
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => resolve(null)
    })
    if (record) return record
  } catch {}

  try {
    const localUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]')
    return localUsers.find((u) => u.id === id) || null
  } catch {
    return null
  }
}

/**
 * Retrieves a user by their email address (case-insensitive).
 */
export async function getUserByEmail(email) {
  if (!email) return null
  const normalized = email.trim().toLowerCase()

  try {
    if (typeof indexedDB === 'undefined') throw new Error('no idb')
    const db = await openDB()
    const record = await new Promise((resolve) => {
      const tx = db.transaction(USERS_STORE, 'readonly')
      const store = tx.objectStore(USERS_STORE)
      if (store.indexNames.contains('email')) {
        const index = store.index('email')
        const req = index.get(normalized)
        req.onsuccess = () => resolve(req.result || null)
        req.onerror = () => resolve(null)
      } else {
        const req = store.getAll()
        req.onsuccess = () => {
          const list = req.result || []
          resolve(list.find((u) => u.email?.toLowerCase() === normalized) || null)
        }
        req.onerror = () => resolve(null)
      }
    })
    if (record) return record
  } catch {}

  try {
    const localUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]')
    return localUsers.find((u) => u.email?.toLowerCase() === normalized) || null
  } catch {
    return null
  }
}

/**
 * Retrieves all registered users in the local database.
 */
export async function getAllUsers() {
  try {
    if (typeof indexedDB === 'undefined') throw new Error('no idb')
    const db = await openDB()
    const records = await new Promise((resolve) => {
      const tx = db.transaction(USERS_STORE, 'readonly')
      const store = tx.objectStore(USERS_STORE)
      const req = store.getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => resolve([])
    })
    if (Array.isArray(records) && records.length > 0) return records
  } catch {}

  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Deletes a user record by ID.
 */
export async function deleteUserRecord(id) {
  try {
    const localUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]')
    const filtered = localUsers.filter((u) => u.id !== id)
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(filtered))
  } catch {}

  try {
    const db = await openDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(USERS_STORE, 'readwrite')
      const store = tx.objectStore(USERS_STORE)
      store.delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('IndexedDB deleteUserRecord warning:', err)
  }
}
