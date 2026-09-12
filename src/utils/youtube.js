/**
 * Utility functions for parsing, fetching, and normalizing YouTube playlists and tracks.
 */

export const SAMPLE_PLAYLISTS = [
  {
    title: "Today's Top Hits & Pop",
    description: "Trending pop and global billboard charts",
    url: "https://www.youtube.com/playlist?list=PLw-VjHDlEOgvtnnnqWlTqByAtC7tXBg6D",
    id: "PLw-VjHDlEOgvtnnnqWlTqByAtC7tXBg6D",
    count: "100 tracks",
  },
  {
    title: "Synthwave / Retro Chill",
    description: "Futuristic neon beats, dark synth and analog electronic",
    url: "https://www.youtube.com/playlist?list=PL3-Unqi_h4GuhI0-Y0-Yl-kZ1XqKkZpQ9",
    id: "PL3-Unqi_h4GuhI0-Y0-Yl-kZ1XqKkZpQ9",
    count: "40 tracks",
  },
  {
    title: "Lo-Fi Beats to Relax / Study",
    description: "Chill beats, ambient vibes and warm vinyl melodies",
    url: "https://www.youtube.com/playlist?list=PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo",
    id: "PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo",
    count: "50 tracks",
  },
]

/**
 * Extracts a YouTube playlist ID from various URL formats or raw ID.
 */
export function extractPlaylistId(input) {
  if (!input || typeof input !== 'string') return null
  const trimmed = input.trim()

  // Match list= parameter in URL
  const listMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/i)
  if (listMatch) return listMatch[1]

  // Direct playlist ID (usually starts with PL, RD, OL, etc.)
  if (/^[a-zA-Z0-9_-]{12,}$/.test(trimmed)) {
    return trimmed
  }

  return null
}

/**
 * Extracts a YouTube video ID from various URL formats or raw ID.
 */
export function extractVideoId(input) {
  if (!input || typeof input !== 'string') return null
  const trimmed = input.trim()

  // youtu.be/<id>
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i)
  if (shortMatch) return shortMatch[1]

  // youtube.com/watch?v=<id>
  const vMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/i)
  if (vMatch) return vMatch[1]

  // youtube.com/embed/<id>
  const embedMatch = trimmed.match(/\/embed\/([a-zA-Z0-9_-]{11})/i)
  if (embedMatch) return embedMatch[1]

  // Direct 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  return null
}

const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://inv.tux.pizza',
  'https://invidious.jing.rocks',
  'https://yewtu.be',
]

/**
 * Fetches playlist metadata and videos.
 * Supports playlist URLs or single video URLs.
 */
export async function fetchYouTubePlaylist(urlOrId) {
  const playlistId = extractPlaylistId(urlOrId)
  const videoId = extractVideoId(urlOrId)

  // 1. If it's a single video (no playlist ID found, but video ID exists)
  if (!playlistId && videoId) {
    const singleTrack = await fetchSingleVideoInfo(videoId)
    return {
      id: `yt_single_${videoId}`,
      playlistId: videoId,
      url: typeof urlOrId === 'string' ? urlOrId : `https://youtube.com/watch?v=${videoId}`,
      title: singleTrack.title,
      author: singleTrack.artist,
      thumbnail: singleTrack.thumbnail,
      trackCount: 1,
      tracks: [singleTrack],
      savedAt: Date.now(),
      isYouTube: true,
    }
  }

  if (!playlistId) {
    throw new Error('Please enter a valid YouTube Playlist URL or Video link.')
  }

  // 2. Try Invidious instances to fetch the playlist
  let lastError = null
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const endpoint = `${instance}/api/v1/playlists/${playlistId}`
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(6000) })
      if (!res.ok) continue

      const data = await res.json()
      if (!data || !Array.isArray(data.videos)) continue

      const playlistTitle = data.title || 'YouTube Playlist'
      const author = data.author || 'YouTube'

      const tracks = data.videos
        .filter((v) => v.videoId && v.title)
        .map((v) => ({
          id: `yt_${v.videoId}`,
          title: cleanYouTubeTitle(v.title),
          artist: v.author?.trim() || author || 'YouTube Artist',
          album: playlistTitle,
          duration: typeof v.lengthSeconds === 'number' ? v.lengthSeconds : 180,
          thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
          isYouTube: true,
          youtubeId: v.videoId,
          hue: 5, // YouTube red hue
        }))

      if (tracks.length > 0) {
        return {
          id: `yt_pl_${playlistId}`,
          playlistId,
          url: typeof urlOrId === 'string' ? urlOrId : `https://youtube.com/playlist?list=${playlistId}`,
          title: playlistTitle,
          author,
          thumbnail: tracks[0]?.thumbnail || '',
          trackCount: tracks.length,
          tracks,
          savedAt: Date.now(),
          isYouTube: true,
        }
      }
    } catch (err) {
      lastError = err
      // try next instance
    }
  }

  // 3. Fallback: Try YouTube RSS Feed via public CORS proxy
  try {
    const rssTracks = await fetchPlaylistViaRss(playlistId)
    if (rssTracks && rssTracks.tracks.length > 0) {
      return {
        id: `yt_pl_${playlistId}`,
        playlistId,
        url: typeof urlOrId === 'string' ? urlOrId : `https://youtube.com/playlist?list=${playlistId}`,
        title: rssTracks.title || 'YouTube Playlist',
        author: rssTracks.author || 'YouTube',
        thumbnail: rssTracks.tracks[0]?.thumbnail || '',
        trackCount: rssTracks.tracks.length,
        tracks: rssTracks.tracks,
        savedAt: Date.now(),
        isYouTube: true,
      }
    }
  } catch (rssErr) {
    console.warn('RSS fallback failed:', rssErr)
  }

  // If we had a videoId alongside the playlist parameter, return at least the single video
  if (videoId) {
    try {
      const fallbackTrack = await fetchSingleVideoInfo(videoId)
      return {
        id: `yt_pl_${playlistId || videoId}`,
        playlistId: playlistId || videoId,
        url: typeof urlOrId === 'string' ? urlOrId : '',
        title: fallbackTrack.album || 'YouTube Track',
        author: fallbackTrack.artist,
        thumbnail: fallbackTrack.thumbnail,
        trackCount: 1,
        tracks: [fallbackTrack],
        savedAt: Date.now(),
        isYouTube: true,
      }
    } catch {
      // ignore
    }
  }

  throw new Error(
    lastError?.message ||
      'Could not fetch playlist. Please check that the playlist is public and try again.'
  )
}

/**
 * Fetches information for a single video using oEmbed (fast & reliable).
 */
export async function fetchSingleVideoInfo(videoId) {
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
      { signal: AbortSignal.timeout(4000) }
    )
    if (res.ok) {
      const data = await res.json()
      return {
        id: `yt_${videoId}`,
        title: cleanYouTubeTitle(data.title || 'YouTube Video'),
        artist: data.author_name || 'YouTube Creator',
        album: 'YouTube Single',
        duration: 210,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        isYouTube: true,
        youtubeId: videoId,
        hue: 5,
      }
    }
  } catch (err) {
    console.warn('oEmbed fetch error:', err)
  }

  return {
    id: `yt_${videoId}`,
    title: `YouTube Track (${videoId})`,
    artist: 'YouTube',
    album: 'YouTube Single',
    duration: 210,
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    isYouTube: true,
    youtubeId: videoId,
    hue: 5,
  }
}

/**
 * Parses a YouTube playlist XML feed via allorigins CORS proxy.
 */
async function fetchPlaylistViaRss(playlistId) {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`
  const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) })
  if (!res.ok) return null

  const xmlText = await res.text()
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlText, 'text/xml')

  const title = xml.querySelector('feed > title')?.textContent || 'YouTube Playlist'
  const author = xml.querySelector('feed > author > name')?.textContent || 'YouTube'
  const entries = Array.from(xml.querySelectorAll('entry'))

  const tracks = entries.map((entry) => {
    const videoId = entry.querySelector('yt\\:videoId, videoId')?.textContent || ''
    const entryTitle = entry.querySelector('title')?.textContent || 'Untitled'
    const entryAuthor = entry.querySelector('author > name')?.textContent || author

    return {
      id: `yt_${videoId}`,
      title: cleanYouTubeTitle(entryTitle),
      artist: entryAuthor,
      album: title,
      duration: 200,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isYouTube: true,
      youtubeId: videoId,
      hue: 5,
    }
  }).filter(t => t.youtubeId)

  return { title, author, tracks }
}

/**
 * Removes generic noisy suffixes like "(Official Music Video)" or "[4K 60FPS]".
 */
function cleanYouTubeTitle(title) {
  if (!title) return 'Untitled Track'
  return title
    .replace(/\s*[\(\[](Official\s+(Music\s+)?(Video|Audio|Remaster|Visualizer|HD|4K|Lyric Video))[\)\]]/gi, '')
    .replace(/\s*[\(\[](4K|HD|HQ|HQ Audio|Audio Only)[\)\]]/gi, '')
    .trim()
}
