import { useState, useRef, useEffect } from 'react'
import {
  Youtube,
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Search,
  ExternalLink,
  Play,
  Plus,
  Check,
  Sparkles,
  Music2,
  Tv,
  ListMusic,
  Share2,
  Lock,
  Layers,
  Flame,
  Radio,
  Coffee,
  Disc,
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import { extractPlaylistId, extractVideoId, fetchYouTubePlaylist } from '../utils/youtube'

const QUICK_BOOKMARKS = [
  {
    id: 'ytm-charts',
    title: 'Top 50 Global Charts',
    tag: 'Trending Worldwide',
    url: 'https://music.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx',
    videoId: null,
    playlistId: 'PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx',
    icon: Flame,
    color: '#ff0033',
  },
  {
    id: 'ytm-bollywood',
    title: 'Bollywood Hits & Romance',
    tag: 'Top Desi Melodies',
    url: 'https://music.youtube.com/playlist?list=PL9bw4S5ePsEGpT9PdWJYN8joMa2eWAxJf',
    videoId: null,
    playlistId: 'PL9bw4S5ePsEGpT9PdWJYN8joMa2eWAxJf',
    icon: Sparkles,
    color: '#f59e0b',
  },
  {
    id: 'ytm-lofi',
    title: 'Lofi Hip Hop 24/7 Live',
    tag: 'Beats to Relax/Study',
    url: 'https://music.youtube.com/watch?v=jfKfPfyJRdk',
    videoId: 'jfKfPfyJRdk',
    playlistId: null,
    icon: Coffee,
    color: '#8b5cf6',
  },
  {
    id: 'ytm-party',
    title: 'Dance & Club Anthems',
    tag: 'Electrifying EDM & Pop',
    url: 'https://music.youtube.com/playlist?list=PLw-VjHDlEOgvtnnnqWlTqByAtC7tXBg6D',
    videoId: null,
    playlistId: 'PLw-VjHDlEOgvtnnnqWlTqByAtC7tXBg6D',
    icon: Disc,
    color: '#ec4899',
  },
  {
    id: 'ytm-radio',
    title: 'Synthwave Cyber Radio',
    tag: '24/7 Retro Chill Stream',
    url: 'https://music.youtube.com/watch?v=4xDzrJKXOOY',
    videoId: '4xDzrJKXOOY',
    playlistId: null,
    icon: Radio,
    color: '#06b6d4',
  },
]

export default function YouTubeMusicBrowser() {
  const [currentUrl, setCurrentUrl] = useState('https://music.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx')
  const [inputUrl, setInputUrl] = useState('https://music.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx')
  const [history, setHistory] = useState(['https://music.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx'])
  const [historyIdx, setHistoryIdx] = useState(0)
  const [isCloning, setIsCloning] = useState(false)
  const [clonedSuccess, setClonedSuccess] = useState(false)
  const [clonedData, setClonedData] = useState(null)
  const [statusMsg, setStatusMsg] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const play = usePlayerStore((s) => s.play)
  const importYouTubePlaylist = usePlayerStore((s) => s.importYouTubePlaylist)
  const playVideoStream = usePlayerStore((s) => s.playVideoStream)
  const currentId = usePlayerStore((s) => s.currentId)
  const isPlaying = usePlayerStore((s) => s.isPlaying)

  // Parse current URL for video or playlist embedding
  const currentVideoId = extractVideoId(currentUrl)
  const currentPlaylistId = extractPlaylistId(currentUrl)

  const handleNavigate = (newUrl) => {
    let formatted = newUrl.trim()
    if (!formatted) return

    // If user enters search keywords instead of URL
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      if (formatted.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(formatted)) {
        formatted = `https://music.youtube.com/watch?v=${formatted}`
      } else if (formatted.length >= 12 && /^[a-zA-Z0-9_-]{12,}$/.test(formatted)) {
        formatted = `https://music.youtube.com/playlist?list=${formatted}`
      } else {
        formatted = `https://music.youtube.com/search?q=${encodeURIComponent(formatted)}`
      }
    }

    setInputUrl(formatted)
    setCurrentUrl(formatted)

    // Push into history stack
    const updatedHistory = history.slice(0, historyIdx + 1)
    updatedHistory.push(formatted)
    setHistory(updatedHistory)
    setHistoryIdx(updatedHistory.length - 1)
    setClonedData(null)
    setClonedSuccess(false)
  }

  const handleBack = () => {
    if (historyIdx > 0) {
      const prevUrl = history[historyIdx - 1]
      setHistoryIdx(historyIdx - 1)
      setCurrentUrl(prevUrl)
      setInputUrl(prevUrl)
    }
  }

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      const nextUrl = history[historyIdx + 1]
      setHistoryIdx(historyIdx + 1)
      setCurrentUrl(nextUrl)
      setInputUrl(nextUrl)
    }
  }

  const handleReload = () => {
    setRefreshKey((k) => k + 1)
  }

  // Clone & Import current URL directly into Wavelength player
  const handleCloneToWavelength = async () => {
    setIsCloning(true)
    setStatusMsg('Extracting audio & metadata from URL...')

    try {
      const data = await fetchYouTubePlaylist(currentUrl)
      if (data && data.tracks && data.tracks.length > 0) {
        await importYouTubePlaylist(data.tracks)
        setClonedData(data)
        setClonedSuccess(true)
        setStatusMsg(`Successfully cloned ${data.tracks.length} track${data.tracks.length > 1 ? 's' : ''}!`)
        setTimeout(() => setClonedSuccess(false), 4000)
      } else {
        setStatusMsg('Could not find playable tracks at this URL.')
      }
    } catch (err) {
      setStatusMsg('Failed to clone. Ensure the playlist or video is public.')
    } finally {
      setIsCloning(false)
    }
  }

  // Build embed src
  const embedSrc = (() => {
    if (currentPlaylistId) {
      return `https://www.youtube.com/embed/videoseries?list=${currentPlaylistId}&autoplay=1&enablejsapi=1`
    }
    if (currentVideoId) {
      return `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1`
    }
    return `https://www.youtube.com/embed/videoseries?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx&autoplay=0`
  })()

  return (
    <div className="ytm-browser-page">
      {/* Browser Chrome Header */}
      <div className="ytm-browser-chrome">
        <div className="ytm-chrome-nav-group">
          <button
            className="ytm-nav-btn"
            onClick={handleBack}
            disabled={historyIdx <= 0}
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            className="ytm-nav-btn"
            onClick={handleForward}
            disabled={historyIdx >= history.length - 1}
            title="Forward"
            aria-label="Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button
            className="ytm-nav-btn"
            onClick={handleReload}
            title="Reload Page"
            aria-label="Reload"
          >
            <RotateCw size={15} />
          </button>
        </div>

        {/* Omnibox / URL Address Input */}
        <form
          className="ytm-omnibox-form"
          onSubmit={(e) => {
            e.preventDefault()
            handleNavigate(inputUrl)
          }}
        >
          <div className="ytm-omnibox">
            <div className="ytm-security-badge" title="Secure connection">
              <Lock size={12} className="ytm-lock-icon" />
              <Youtube size={14} className="ytm-icon-red" />
            </div>
            <input
              type="text"
              className="ytm-url-input"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste any YouTube Music link or search..."
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <button type="submit" className="ytm-go-btn" title="Navigate to URL">
              Go
            </button>
          </div>
        </form>

        {/* Chrome Action Buttons */}
        <div className="ytm-chrome-actions">
          <button
            className={`ytm-clone-btn ${clonedSuccess ? 'success' : ''}`}
            onClick={handleCloneToWavelength}
            disabled={isCloning}
            title="Clone tracks from this web page into your Wavelength Library"
          >
            {clonedSuccess ? (
              <>
                <Check size={14} />
                <span>Cloned!</span>
              </>
            ) : isCloning ? (
              <>
                <RotateCw size={14} className="spin-slow" />
                <span>Cloning...</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Clone to Library</span>
              </>
            )}
          </button>

          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ytm-open-ext-btn"
            title="Open in new window"
          >
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      {/* Status Banner */}
      {statusMsg && (
        <div className="ytm-status-toast">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg('')} className="ytm-status-dismiss">
            ×
          </button>
        </div>
      )}

      {/* Quick Presets / Bookmarks Row */}
      <div className="ytm-bookmarks-bar">
        <span className="ytm-bookmarks-label">Quick Presets:</span>
        <div className="ytm-bookmarks-scroll">
          {QUICK_BOOKMARKS.map((bm) => {
            const Icon = bm.icon
            const isCurrent = currentUrl === bm.url
            return (
              <button
                key={bm.id}
                className={`ytm-bookmark-pill ${isCurrent ? 'active' : ''}`}
                onClick={() => handleNavigate(bm.url)}
              >
                <Icon size={13} style={{ color: bm.color }} />
                <span>{bm.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Player & Browser Workspace */}
      <div className="ytm-workspace">
        {/* Embedded Live Player Frame */}
        <div className="ytm-player-card">
          <div className="ytm-player-header">
            <div className="ytm-player-title-row">
              <span className="ytm-brand-badge">
                <Youtube size={15} fill="#ff0033" color="#ff0033" />
                <span>YouTube Music In-App Player</span>
              </span>
              <span className="ytm-resolution-pill">HIGH FIDELITY STREAM</span>
            </div>
            <div className="ytm-url-display mono">{currentUrl}</div>
          </div>

          <div className="ytm-iframe-wrapper">
            <iframe
              key={refreshKey}
              src={embedSrc}
              title="YouTube Music Embedded Player"
              className="ytm-live-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Recently Cloned Tracks Drawer (if user cloned or viewed) */}
        {clonedData && clonedData.tracks && clonedData.tracks.length > 0 && (
          <div className="ytm-cloned-preview-section">
            <div className="ytm-section-header">
              <h3 className="ytm-section-title">
                <ListMusic size={18} />
                <span>Cloned Playlist: {clonedData.title || 'Imported Tracks'}</span>
                <span className="ytm-count-badge">({clonedData.tracks.length} tracks)</span>
              </h3>
            </div>

            <div className="ytm-cloned-grid">
              {clonedData.tracks.slice(0, 8).map((t, i) => (
                <div
                  key={t.id || i}
                  className="ytm-cloned-track-card"
                  onClick={() => play(t.id)}
                >
                  <img
                    src={t.thumbnail}
                    alt={t.title}
                    className="ytm-cloned-art"
                    loading="lazy"
                  />
                  <div className="ytm-cloned-info">
                    <div className="ytm-cloned-title">{t.title}</div>
                    <div className="ytm-cloned-artist">{t.artist}</div>
                  </div>
                  <button className="ytm-cloned-play" title="Play track in Wavelength">
                    <Play size={14} fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
