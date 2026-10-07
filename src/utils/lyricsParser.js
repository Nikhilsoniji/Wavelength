/**
 * Enhanced LRC (Lyrics) Parser & Synchronizer for Wavelength.
 * Supports standard timestamped LRC tags: [mm:ss.xx] or [mm:ss]
 */

export function parseLRC(lrcText) {
  if (!lrcText || typeof lrcText !== 'string') return []

  const lines = lrcText.split('\n')
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g
  const parsed = []

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim()
    if (!rawLine) continue

    // Extract all timestamps in the line (handles multiple timestamps per line)
    const timestamps = []
    let match
    timeRegex.lastIndex = 0

    while ((match = timeRegex.exec(rawLine)) !== null) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      const millisRaw = match[3] || '0'
      const fraction = millisRaw.length === 2 ? parseInt(millisRaw, 10) / 100 : parseInt(millisRaw, 10) / 1000
      const totalSeconds = minutes * 60 + seconds + fraction
      timestamps.push(totalSeconds)
    }

    if (timestamps.length === 0) continue

    // Clean text by stripping timestamp brackets
    const text = rawLine.replace(/\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/g, '').trim()

    // Skip empty metadata lines like [ar:Artist], [ti:Title]
    if (!text && rawLine.match(/^\[(ti|ar|al|by|offset|length):/i)) continue

    for (const time of timestamps) {
      parsed.push({
        id: `line-${time.toFixed(2)}-${i}`,
        time,
        text: text || '♪ ♪ ♪',
      })
    }
  }

  // Sort chronologically by start time
  parsed.sort((a, b) => a.time - b.time)

  // Calculate duration/endTime for each line
  for (let i = 0; i < parsed.length; i++) {
    const nextLine = parsed[i + 1]
    parsed[i].endTime = nextLine ? nextLine.time : parsed[i].time + 6.0
    parsed[i].duration = Math.max(1, parsed[i].endTime - parsed[i].time)
  }

  return parsed
}

/**
 * Returns the index of the currently active line for a given playback time.
 */
export function getActiveLineIndex(lyrics, currentTime) {
  if (!lyrics || lyrics.length === 0) return -1
  if (currentTime < lyrics[0].time) return -1

  // Binary search for O(log N) lookup
  let low = 0
  let high = lyrics.length - 1
  let best = 0

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (lyrics[mid].time <= currentTime) {
      best = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return best
}

/**
 * Formats seconds into MM:SS display
 */
export function formatLyricTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}
