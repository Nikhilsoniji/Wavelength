import { useState } from 'react'
import {
  Youtube,
  X,
  Link,
  Music2,
  Sparkles,
  Play,
  Check,
  AlertCircle,
  Loader2,
  ListPlus,
  Clipboard,
  Trash2,
  BookmarkCheck,
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import { fetchYouTubePlaylist, SAMPLE_PLAYLISTS } from '../utils/youtube'

export default function ImportYouTubeModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importedSuccess, setImportedSuccess] = useState(false)

  const importYouTubePlaylist = usePlayerStore((s) => s.importYouTubePlaylist)
  const savedPlaylists = usePlayerStore((s) => s.savedPlaylists)
  const playPlaylist = usePlayerStore((s) => s.playPlaylist)
  const deletePlaylist = usePlayerStore((s) => s.deletePlaylist)
  const savePlaylist = usePlayerStore((s) => s.savePlaylist)

  if (!isOpen) return null

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text)
        handleFetchPreview(text)
      }
    } catch {
      // clipboard permission denied
    }
  }

  const handleFetchPreview = async (overrideUrl) => {
    const targetUrl = (overrideUrl || url).trim()
    if (!targetUrl) {
      setError('Please paste a YouTube playlist or video link.')
      return
    }

    // First check if already in savedPlaylists
    const existing = savedPlaylists.find(
      (p) => p.url === targetUrl || (p.playlistId && targetUrl.includes(p.playlistId))
    )
    if (existing) {
      setPreview(existing)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    setPreview(null)
    setImportedSuccess(false)

    try {
      const data = await fetchYouTubePlaylist(targetUrl)
      setPreview(data)
      // Auto-save so it's stored forever immediately!
      if (data && data.tracks && data.tracks.length > 0) {
        await savePlaylist(data)
      }
    } catch (err) {
      setError(err.message || 'Failed to load playlist. Please ensure it is public.')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (autoPlay = true) => {
    if (!preview && !url.trim()) return

    // If preview is already loaded from saved or fetched
    if (preview && preview.tracks && preview.tracks.length > 0) {
      await savePlaylist(preview)
      if (autoPlay) {
        playPlaylist(preview)
      }
      setImportedSuccess(true)
      setTimeout(() => {
        onClose()
      }, 700)
      return
    }

    const targetUrl = url.trim()
    setImporting(true)
    setError(null)

    try {
      await importYouTubePlaylist(targetUrl, autoPlay)
      setImportedSuccess(true)
      setTimeout(() => {
        onClose()
      }, 700)
    } catch (err) {
      setError(err.message || 'Import failed. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  const selectSample = (sample) => {
    setUrl(sample.url)
    handleFetchPreview(sample.url)
  }

  const handlePlaySaved = (pl) => {
    playPlaylist(pl)
    onClose()
  }

  const handleSelectSaved = (pl) => {
    setPreview(pl)
    setUrl(pl.url || '')
  }

  const handleDeleteSaved = (e, pl) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${pl.title}" from your saved playlists?`)) {
      deletePlaylist(pl.id)
      if (preview?.id === pl.id) {
        setPreview(null)
      }
    }
  }

  return (
    <div className="modal-backdrop fade-in" onClick={onClose}>
      <div
        className="yt-import-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="yt-modal-header">
          <div className="yt-modal-title-group">
            <div className="yt-logo-badge">
              <Youtube size={22} className="yt-icon-red" />
            </div>
            <div>
              <h3 className="yt-modal-title">YouTube Playlist Hub</h3>
              <p className="yt-modal-sub">
                Saved forever — stream anytime without copying links again
              </p>
            </div>
          </div>
          <button className="yt-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="yt-modal-body">
          {/* URL Input Form */}
          <div className="yt-input-wrap">
            <div className="yt-input-prefix">
              <Link size={16} />
            </div>
            <input
              type="text"
              className="yt-input-field"
              placeholder="Paste YouTube or YouTube Music playlist link..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFetchPreview()
              }}
              autoFocus
            />
            {navigator.clipboard && (
              <button
                type="button"
                className="yt-paste-btn"
                onClick={handlePaste}
                title="Paste from clipboard"
              >
                <Clipboard size={14} />
                <span>Paste</span>
              </button>
            )}
            <button
              className="yt-fetch-btn"
              onClick={() => handleFetchPreview()}
              disabled={loading || !url.trim()}
            >
              {loading ? <Loader2 size={16} className="spin-slow" /> : 'Fetch & Save'}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="yt-presets-section">
            <span className="yt-presets-label">Quick Try Presets:</span>
            <div className="yt-presets-chips">
              {SAMPLE_PLAYLISTS.map((sample, idx) => (
                <button
                  key={idx}
                  className="yt-preset-chip"
                  onClick={() => selectSample(sample)}
                  type="button"
                >
                  <Sparkles size={12} />
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="yt-error-box">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Preview Container */}
          {preview && (
            <div className="yt-preview-box fade-in">
              <div className="yt-preview-header">
                {preview.tracks[0]?.thumbnail && (
                  <img
                    src={preview.tracks[0].thumbnail}
                    alt=""
                    className="yt-preview-thumb"
                  />
                )}
                <div className="yt-preview-meta">
                  <div className="yt-preview-tag-row">
                    <span className="yt-preview-tag">PLAYLIST LOADED</span>
                    <span className="yt-saved-badge-chip">
                      <BookmarkCheck size={11} />
                      <span>Saved Forever</span>
                    </span>
                  </div>
                  <h4 className="yt-preview-title">{preview.title}</h4>
                  <p className="yt-preview-artist">
                    By {preview.author} • {preview.tracks.length} tracks
                  </p>
                </div>
              </div>

              {/* Sample list of first 4 tracks */}
              <div className="yt-preview-tracklist">
                {preview.tracks.slice(0, 4).map((t, i) => (
                  <div key={t.id || i} className="yt-preview-track-item">
                    <span className="yt-track-idx">{i + 1}</span>
                    <img src={t.thumbnail} alt="" className="yt-track-mini-thumb" />
                    <div className="yt-track-mini-info">
                      <span className="yt-track-mini-title">{t.title}</span>
                      <span className="yt-track-mini-artist">{t.artist}</span>
                    </div>
                  </div>
                ))}
                {preview.tracks.length > 4 && (
                  <div className="yt-preview-more">
                    + {preview.tracks.length - 4} more tracks in this playlist
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Permanent Saved Playlists Shelf */}
          {savedPlaylists.length > 0 && (
            <div className="yt-saved-section">
              <div className="yt-saved-header">
                <span className="yt-saved-title">Your Saved Playlists ({savedPlaylists.length})</span>
                <span className="yt-saved-hint">1-click instant play without re-fetching</span>
              </div>
              <div className="yt-saved-list">
                {savedPlaylists.map((pl) => {
                  const isCurrentPreview = preview?.id === pl.id || preview?.playlistId === pl.playlistId
                  return (
                    <div
                      key={pl.id}
                      className={`yt-saved-item ${isCurrentPreview ? 'active' : ''}`}
                    >
                      <div
                        className="yt-saved-thumb-wrap"
                        onClick={() => handlePlaySaved(pl)}
                        title="Click to play playlist now"
                      >
                        <img
                          src={pl.thumbnail || pl.tracks?.[0]?.thumbnail}
                          alt=""
                          className="yt-saved-thumb"
                        />
                        <div className="yt-saved-play-overlay">
                          <Play size={14} fill="#fff" color="#fff" />
                        </div>
                      </div>
                      <div className="yt-saved-info" onClick={() => handleSelectSaved(pl)}>
                        <span className="yt-saved-item-title">{pl.title}</span>
                        <span className="yt-saved-item-sub">
                          {pl.trackCount || pl.tracks?.length || 0} tracks • By {pl.author}
                        </span>
                      </div>
                      <div className="yt-saved-item-actions">
                        <button
                          className="yt-saved-action-btn yt-saved-play-btn"
                          onClick={() => handlePlaySaved(pl)}
                          title="Play playlist now"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Play</span>
                        </button>
                        <button
                          className="yt-saved-action-btn yt-saved-load-btn"
                          onClick={() => handleSelectSaved(pl)}
                          title="View tracks"
                        >
                          View
                        </button>
                        <button
                          className="yt-saved-action-btn yt-saved-del-btn"
                          onClick={(e) => handleDeleteSaved(e, pl)}
                          title="Remove saved playlist"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="yt-modal-footer">
          <button className="yt-btn-secondary" onClick={onClose} disabled={importing}>
            Close
          </button>

          {preview ? (
            <div className="yt-action-btns">
              <button
                className="yt-btn-secondary"
                onClick={() => handleImport(false)}
                disabled={importing || importedSuccess}
              >
                <ListPlus size={16} />
                <span>{savedPlaylists.some((p) => p.id === preview.id) ? 'Saved' : 'Save to Library'}</span>
              </button>
              <button
                className="yt-btn-primary"
                onClick={() => handleImport(true)}
                disabled={importing || importedSuccess}
              >
                {importing ? (
                  <>
                    <Loader2 size={16} className="spin-slow" />
                    <span>Loading...</span>
                  </>
                ) : importedSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Playing Now!</span>
                  </>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" />
                    <span>Play Playlist</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              className="yt-btn-primary"
              onClick={() => handleFetchPreview()}
              disabled={loading || !url.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin-slow" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Music2 size={16} />
                  <span>Fetch Playlist</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
