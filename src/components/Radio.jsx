import { useState, useMemo } from 'react'
import { Play, Pause, Radio as RadioIcon, Search, Signal, RefreshCw } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'

export default function RadioPage() {
  const library = usePlayerStore((s) => s.library)
  const currentId = usePlayerStore((s) => s.currentId)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)
  const loadRadioStations = usePlayerStore((s) => s.loadRadioStations)

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const stations = useMemo(
    () => library.filter((track) => track.isLive),
    [library]
  )

  const categories = ['All', 'Bollywood', 'News', 'Popular', 'Regional']

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
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
  }, [stations, search, activeCategory])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadRadioStations()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <div className="radio-page">
      {/* Header section */}
      <div className="radio-header-card card">
        <div className="radio-header-content">
          <div className="radio-badge">
            <span className="live-dot" /> LIVE STREAMING
          </div>
          <h1>Indian Radio Directory</h1>
          <p className="muted">
            Tune into live FM, Bollywood hits, news & regional radio broadcasts across India.
          </p>
        </div>

        <div className="radio-header-controls">
          <div className="radio-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search station or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className={`radio-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            title="Refresh Stations"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="radio-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`radio-cat-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <span className="radio-count-badge">{filteredStations.length} Stations</span>
      </div>

      {/* Radio Stations Grid */}
      {filteredStations.length === 0 ? (
        <div className="radio-empty card">
          <RadioIcon size={42} className="empty-icon" />
          <h2>No radio stations found</h2>
          <p className="muted">Try adjusting your search query or refresh to fetch stations.</p>
          <button className="hero-btn outline" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="radio-grid">
          {filteredStations.map((station) => {
            const isCurrent = station.id === currentId
            const isCurrentlyPlaying = isCurrent && isPlaying

            return (
              <div
                key={station.id}
                className={`radio-card card ${isCurrentlyPlaying ? 'playing' : ''}`}
              >
                {/* Top Section */}
                <div className="radio-card-body">
                  <div className="radio-cover-wrapper">
                    {station.cover ? (
                      <img src={station.cover} alt={station.title} className="radio-cover-img" />
                    ) : (
                      <div className="radio-cover-fallback">
                        <Signal size={24} />
                      </div>
                    )}
                    {isCurrentlyPlaying && (
                      <div className="radio-live-indicator">
                        <span className="live-pulse" /> PLAYING
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
                    <div className="radio-location muted" title={station.album}>
                      📍 {station.album || 'India'}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button - Perfectly Aligned across all cards */}
                <div className="radio-card-footer">
                  <button
                    className={`radio-play-btn ${isCurrentlyPlaying ? 'active' : ''}`}
                    onClick={() => (isCurrent ? toggle() : play(station.id))}
                  >
                    {isCurrentlyPlaying ? (
                      <>
                        <Pause size={16} fill="currentColor" />
                        <span>Pause Stream</span>
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
    </div>
  )
}
