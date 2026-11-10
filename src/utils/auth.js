import { saveUserRecord, getUserByEmail, getUserById, getAllUsers } from './db.js'

const LOCAL_STORAGE_SESSION_KEY = 'wavelength_active_user'
const PASSWORD_SALT = '::wavelength_offline_crypto_salt_v3::'

/**
 * Hashes a plain text password using Web Crypto API (SHA-256).
 * Safely falls back if Web Crypto is unavailable.
 */
export async function hashPassword(password) {
  if (!password) return ''
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(password + PASSWORD_SALT)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    }
  } catch (err) {
    console.warn('Web Crypto hashing error, using fallback:', err)
  }

  // Pure JavaScript hash fallback (e.g. for non-https/legacy)
  let hash = 0
  const combined = password + PASSWORD_SALT
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i)
    hash |= 0
  }
  return 'wl_hash_' + Math.abs(hash).toString(16)
}

/**
 * Strips sensitive fields (like passwordHash) before storing in state or session.
 */
export function sanitizeUser(user) {
  if (!user) return null
  const { passwordHash, ...safeUser } = user
  return safeUser
}

/**
 * Retrieves the currently active user session from local storage.
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return sanitizeUser(parsed)
    }
  } catch {}
  return null
}

/**
 * Persists the active user session.
 */
export function setActiveUser(user) {
  if (!user) {
    clearActiveUser()
    return
  }
  try {
    const safe = sanitizeUser(user)
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(safe))
  } catch (err) {
    console.warn('Failed to set active user session:', err)
  }
}

/**
 * Clears the active user session.
 */
export function clearActiveUser() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY)
  } catch {}
}

/**
 * Signs up a new user and persists their record to the local client database.
 */
export async function signUpLocal({ email, password, name = '' }) {
  if (!email || typeof email !== 'string') {
    throw new Error('Please enter a valid email address.')
  }
  const cleanEmail = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email format (e.g., name@example.com).')
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.')
  }

  // Check if an account already exists in the local database
  const existingUser = await getUserByEmail(cleanEmail)
  if (existingUser) {
    throw new Error('An account with this email already exists. Please sign in.')
  }

  const passwordHash = await hashPassword(password)
  const displayName = name.trim() || cleanEmail.split('@')[0]

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    email: cleanEmail,
    name: displayName,
    passwordHash,
    authProvider: 'email',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      soundQuality: 'lossless',
      haptics: true,
    },
  }

  await saveUserRecord(newUser)
  setActiveUser(newUser)
  return sanitizeUser(newUser)
}

/**
 * Authenticates an existing user against the local client database.
 */
export async function signInLocal({ email, password }) {
  if (!email || !password) {
    throw new Error('Please provide both email and password.')
  }
  const cleanEmail = email.trim().toLowerCase()

  const user = await getUserByEmail(cleanEmail)
  if (!user) {
    throw new Error('No account found with this email. Please check your spelling or sign up.')
  }

  if (user.authProvider !== 'email' && !user.passwordHash) {
    throw new Error(
      `This account was created using ${user.authProvider.toUpperCase()}. Please sign in with ${user.authProvider}.`
    )
  }

  const computedHash = await hashPassword(password)
  if (user.passwordHash !== computedHash) {
    throw new Error('Incorrect password. Please try again.')
  }

  // Update last login timestamp in database
  const updatedUser = {
    ...user,
    lastLoginAt: new Date().toISOString(),
  }
  await saveUserRecord(updatedUser)
  setActiveUser(updatedUser)

  return sanitizeUser(updatedUser)
}

/**
 * Simulates one-click Social Sign-In (Google / Apple) backed by the local database.
 */
export async function signInSocialLocal(provider = 'google') {
  const normProvider = provider.toLowerCase()
  const demoEmail = `${normProvider}.user@wavelength.app`
  const displayName = normProvider === 'google' ? 'Google Explorer' : 'Apple Listener'

  let user = await getUserByEmail(demoEmail)
  if (!user) {
    user = {
      id: `usr_${normProvider}_${Date.now()}`,
      email: demoEmail,
      name: displayName,
      passwordHash: '',
      authProvider: normProvider,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        soundQuality: 'lossless',
        haptics: true,
      },
    }
  } else {
    user.lastLoginAt = new Date().toISOString()
  }

  await saveUserRecord(user)
  setActiveUser(user)
  return sanitizeUser(user)
}

/**
 * Signs in as a Guest and saves a guest session in the local database.
 */
export async function signInGuest() {
  const guestEmail = `guest_${Date.now().toString(36)}@wavelength.local`
  const guestUser = {
    id: `usr_guest_${Date.now()}`,
    email: guestEmail,
    name: 'Guest Listener',
    passwordHash: '',
    authProvider: 'guest',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      soundQuality: 'high',
      haptics: true,
    },
  }

  await saveUserRecord(guestUser)
  setActiveUser(guestUser)
  return sanitizeUser(guestUser)
}

/**
 * Signs out the currently active user.
 */
export function signOutLocal() {
  clearActiveUser()
}

/**
 * Returns diagnostic stats about the local user database.
 */
export async function getUserStats() {
  const all = await getAllUsers()
  return {
    totalUsers: all.length,
    users: all.map(sanitizeUser),
  }
}

