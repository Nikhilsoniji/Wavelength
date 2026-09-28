import { useState, useMemo } from 'react'
import {
  Play,
  Pause,
  Radio as RadioIcon,
  Search,
  Signal,
  RefreshCw,
  MapPin,
  Tv,
  Eye,
  Sparkles,
} from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import { videoStreams } from '../data/tracks'

export default function RadioPage() {
  const library = usePlayerStore((s) => s.library)
  const currentId = usePlayerStore((s) => s.currentId)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)
  const playVideoStream = usePlayerStore((s) => s.playVideoStream)
  const loadRadioStations = usePlayerStore((s) => s.loadRadioStations)

  const [activeTab, setActiveTab] = useState('video') // 'video' | 'audio'
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Audio Radio Stations (non-video live broadcasts)
  const audioStations = useMemo(
    () => library.filter((track) => track.isLive && !track.isVideoStream),
    [library]
  )

  // Live Video Streams (24/7 YouTube music video broadcasts)
  const allVideoStreams = useMemo(() => {
    const existingIds = new Set(videoStreams.map((v) => v.id))
    const extraVideosInLib = library.filter((t) => t.isVideoStream && !existingIds.has(t.id))
    return [...videoStreams, ...extraVideosInLib]
  }, [library])

  const audioCategories = ['All', 'Bollywood', 'News', 'Popular', 'Regional']
  const videoCategories = ['All', 'Lofi Chill', 'Bollywood', 'Synthwave', 'EDM / Dance']

  const filteredAudioStations = useMemo(() => {
    return audioStations.filter((station) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        station.title?.toLowerCase().includes(q) ||
        station.artist?.toLowerCase().includes(q) ||
        station.album?.toLowerCase().includes(q)

      const matchesCat =
        activeCategory === 'All' ||
        station.artist?.toLowerCase().includes(activeCategory.toLowerCase()) ||
        station.title?.toLowerCase().includes(activeCategory.toLowerCase())

      return matchesSearch && matchesCat
    })
  }, [audioStations, search, activeCategory])

  const filteredVideoStreams = useMemo(() => {
    return allVideoStreams.filter((stream) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        stream.title?.toLowerCase().includes(q) ||
        stream.artist?.toLowerCase().includes(q) ||
        stream.genre?.toLowerCase().includes(q)

      const matchesCat =
        activeCategory === 'All' ||
        stream.genre?.toLowerCase().includes(activeCategory.toLowerCase()) ||
        stream.category?.toLowerCase().includes(activeCategory.toLowerCase())

      return matchesSearch && matchesCat
    })
  }, [allVideoStreams, search, activeCategory])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadRadioStations()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <div className="radio-page">
      {/* Header section */}
      <div className="radio-header-card">
        <div className="radio-header-content">
          <div className="radio-badge">
            <span className="live-dot" /> LIVE BROADCASTS & STREAMS
          </div>
          <h1 className="radio-page-title">Live Radio & Video Streams</h1>
          <p className="radio-page-desc">
            Direct 24/7 digital live video streams and premier FM, Bollywood chartbusters & regional stations.
          </p>
        </div>

        <div className="radio-header-controls">
          <div className="radio-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={activeTab === 'video' ? 'Search live video streams...' : 'Search station or city...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {activeTab === 'audio' && (
            <button
              className={`radio-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
              onClick={handleRefresh}
              title="Refresh Stations"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="stream-tab-switcher">
        <button
          className={`stream-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('video')
            setActiveCategory('All')
          }}
        >
          <Tv size={18} />
          <span>📺 24/7 Live Video Streams</span>
          <span className="stream-tab-count">{allVideoStreams.length}</span>
        </button>
        <button
          className={`stream-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('audio')
            setActiveCategory('All')
          }}
        >
          <RadioIcon size={18} />
          <span>📻 Live Audio FM Radio</span>
          <span className="stream-tab-count">{audioStations.length}</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="radio-categories">
        {(activeTab === 'video' ? videoCategories : audioCategories).map((cat) => (
          <button
            key={cat}
            className={`radio-cat-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <span className="radio-count-badge">
          {activeTab === 'video' ? filteredVideoStreams.length : filteredAudioStations.length} Channels
        </span>
      </div>

      {/* 24/7 Live Video Streams Grid */}
      {activeTab === 'video' && (
        <>
          {filteredVideoStreams.length === 0 ? (
            <div className="radio-empty">
              <Tv size={42} className="empty-icon text-cyan" />
              <h2>No live video streams found</h2>
              <p className="muted">Try adjusting your search query or reset filters.</p>
              <button
                className="hero-btn-secondary"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setSearch('')
                  setActiveCategory('All')
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="video-streams-grid">
              {filteredVideoStreams.map((stream) => {
                const isCurrent = stream.id === currentId
                const isCurrentlyPlaying = isCurrent && isPlaying

                return (
                  <div
                    key={stream.id}
                    className={`video-stream-card ${isCurrentlyPlaying ? 'playing' : ''}`}
                    onClick={() => (isCurrentlyPlaying ? toggle() : playVideoStream(stream, 'pip'))}
                  >
                    <div className="vsc-thumbnail-wrap">
                      <img
                        src={stream.thumbnail}
                        alt={stream.title}
                        className="vsc-thumbnail-img"
                        loading="lazy"
                      />
                      <div className="vsc-gradient-overlay" />

                      {/* Live & HD Badges */}
                      <div className="vsc-top-badges">
                        <span className="vsc-live-badge">
                          <span className="live-dot" /> LIVE 24/7
                        </span>
                        <span className="vsc-hd-badge">{stream.quality || '1080P HD'}</span>
                      </div>

                      {/* Play Button Overlay */}
                      <button
                        className="vsc-play-overlay-btn"
                        aria-label={`Play ${stream.title}`}
                      >
                        {isCurrentlyPlaying ? (
                          <Pause size={24} fill="#0a0a0a" />
                        ) : (
                          <Play size={24} fill="#0a0a0a" />
                        )}
                      </button>

                      {/* Viewers counter */}
                      {stream.viewers && (
                        <div className="vsc-viewers-badge">
                          <Eye size={12} />
                          <span>{stream.viewers} watching</span>
                        </div>
                      )}

                      {/* Equalizer animation */}
                      {isCurrentlyPlaying && (
                        <div className="vsc-live-eq">
                          <span className="eq-bar-s" />
                          <span className="eq-bar-s" />
                          <span className="eq-bar-s" />
                        </div>
                      )}
                    </div>

                    <div className="vsc-meta">
                      <div className="vsc-genre-pill">{stream.genre}</div>
                      <h3 className="vsc-title" title={stream.title}>
                        {stream.title}
                      </h3>
                      <p className="vsc-artist" title={stream.artist}>
                        {stream.artist}
                      </p>
                      <div className="vsc-footer-actions">
                        <button
                          className={`vsc-stream-action-btn ${isCurrentlyPlaying ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isCurrentlyPlaying) toggle()
                            else playVideoStream(stream, 'pip')
                          }}
                        >
                          {isCurrentlyPlaying ? (
                            <>
                              <Pause size={14} fill="currentColor" />
                              <span>Pause Stream</span>
                            </>
                          ) : (
                            <>
                              <Tv size={14} />
                              <span>Watch Live Video</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Audio FM Radio Stations Grid */}
      {activeTab === 'audio' && (
        <>
          {filteredAudioStations.length === 0 ? (
            <div className="radio-empty">
              <RadioIcon size={42} className="empty-icon text-cyan" />
              <h2>No radio stations found</h2>
              <p className="muted">Try adjusting your search query or reset filters.</p>
              <button
                className="hero-btn-secondary"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setSearch('')
                  setActiveCategory('All')
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="radio-grid">
              {filteredAudioStations.map((station) => {
                const isCurrent = station.id === currentId
                const isCurrentlyPlaying = isCurrent && isPlaying

                return (
                  <div
                    key={station.id}
                    className={`radio-card ${isCurrentlyPlaying ? 'playing' : ''}`}
                  >
                    {/* Top Section */}
                    <div className="radio-card-body">
                      <div className="radio-cover-wrapper">
                        {station.cover ? (
                          <img src={station.cover} alt={station.title} className="radio-cover-img" />
                        ) : (
                          <div className="radio-cover-fallback">
                            <Signal size={24} className="text-cyan" />
                          </div>
                        )}
                        {isCurrentlyPlaying && (
                          <div className="radio-live-indicator">
                            <span className="live-pulse" /> ON AIR
                          </div>
                        )}
                      </div>

                      <div className="radio-info">
                        <h3 className="radio-title" title={station.title}>
                          {station.title}
                        </h3>
                        <div className="radio-tags" title={station.artist}>
                          {station.artist || 'Live FM'}
                        </div>
                        <div className="radio-location" title={station.album}>
                          <MapPin size={12} className="inline-icon" /> {station.album || 'India'}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="radio-card-footer">
                      <button
                        className={`radio-play-btn ${isCurrentlyPlaying ? 'active' : ''}`}
                        onClick={() => (isCurrent ? toggle() : play(station.id))}
                      >
                        {isCurrentlyPlaying ? (
                          <>
                            <Pause size={16} fill="currentColor" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play size={16} fill="currentColor" />
                            <span>Listen Live</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

