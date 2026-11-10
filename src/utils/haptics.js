import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'

/**
 * Universal Haptic & Tactile Feedback Utility.
 * Uses Capacitor Haptics on iOS/Android native platforms,
 * with graceful fallback to browser navigator.vibrate.
 */
export const haptics = {
  impact: async (style = ImpactStyle.Light) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style })
      } else if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(10)
      }
    } catch {}
  },

  selection: async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.selectionStart()
      } else if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(6)
      }
    } catch {}
  },

  notification: async (type = NotificationType.Success) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.notification({ type })
      } else if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate([12, 40, 12])
      }
    } catch {}
  },
}
