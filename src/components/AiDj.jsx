import { useState, useMemo } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import { Sparkles, Play, Pause, Disc, Flame } from 'lucide-react'

const MOOD_FILTERS = [
  'All Hits',
  'Bollywood Romance',
  'Hollywood Top 100',
  'Party & Dance',
  'Acoustic & Chill',
  'Indie Hindi',
]

export default function AiDj() {
  const library = usePlayerStore((s) => s.library)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentId = usePlayerStore((s) => s.currentId)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)

  const [activeMood, setActiveMood] = useState('All Hits')

  const handlePlayCard = (trackId) => {
    if (!trackId) return
    if (currentId === trackId) {
      toggle()
    } else {
      play(trackId)
    }
  }

  const bollywoodTrack = library.find((t) => t.category === 'Bollywood') || library[0] || {}
  const hollywoodTrack = library.find((t) => t.category === 'Hollywood') || library[1] || {}

  const recommendedTracks = useMemo(() => {
    if (activeMood === 'Bollywood Romance') {
      return library.filter(
        (t) =>
          t.category === 'Bollywood' &&
          (t.genre?.includes('Romantic') ||
            t.genre?.includes('Acoustic') ||
            t.genre?.includes('Folk') ||
            t.genre?.includes('Soulful'))
      )
    }
    if (activeMood === 'Hollywood Top 100') {
      return library.filter((t) => t.category === 'Hollywood')
    }
    if (activeMood === 'Party & Dance') {
      return library.filter(
        (t) =>
          t.genre?.includes('Dance') ||
          t.genre?.includes('Party') ||
          t.genre?.includes('Club') ||
          t.genre?.includes('Punjabi')
      )
    }
    if (activeMood === 'Acoustic & Chill') {
      return library.filter(
        (t) =>
          t.genre?.includes('Acoustic') ||
          t.genre?.includes('Indie') ||
          t.genre?.includes('Soul')
      )
    }
    if (activeMood === 'Indie Hindi') {
      return library.filter(
        (t) =>
          t.category === 'Bollywood' &&
          (t.genre?.includes('Indie') ||
            t.artist?.toLowerCase().includes('anuv') ||
            t.artist?.toLowerCase().includes('jasleen') ||
            t.artist?.toLowerCase().includes('vishal'))
      )
    }
    return library.slice(0, 12)
  }, [library, activeMood])

  return (
    <div className="aidj-container">
      {/* Daily Frequency Greeting */}
      <div className="aidj-greeting">
        <div className="aidj-greeting-inner">
          <div className="greeting-badge">
            <Sparkles size={16} className="sparkle-pulse" />
            <span>AI CURATION</span>
          </div>
          <h1 className="greeting-title">AI DJ & Mixes</h1>
          <p className="greeting-subtitle">
            Curated Bollywood blockbusters and Hollywood chartbusters that dynamically adapt to your vibe.
          </p>
        </div>
      </div>

      {/* Mood Selector Pills */}
      <div className="aidj-mood-pills">
        {MOOD_FILTERS.map((mood) => (
          <button
            key={mood}
            className={`mood-pill-btn ${activeMood === mood ? 'active' : ''}`}
            onClick={() => setActiveMood(mood)}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* AI Recommended Section */}
      <section className="aidj-section">
        <div className="section-header">
          <h2 className="section-title">
            <Flame size={20} color="#f59e0b" />
            <span>Featured Mixes</span>
          </h2>
        </div>

        <div className="aidj-cards-grid">
          {/* Card 1: Bollywood Blockbusters */}
          <div
            className="aidj-card synthwave-card"
            style={{
              background:
                'linear-gradient(135deg, rgba(50, 25, 5, 0.95) 0%, rgba(120, 53, 15, 0.85) 45%, rgba(20, 10, 5, 0.95) 100%)',
            }}
          >
            <div className="card-bg-gradient synthwave-gradient" />
            <div className="card-content">
              <div className="card-tag">
                <span className="live-dot" style={{ background: '#f59e0b' }} />
                <span style={{ color: '#f59e0b' }}>BOLLYWOOD CHARTBUSTERS</span>
              </div>
              <h3 className="card-heading">Desi Top 50 Mix</h3>
              <p className="card-desc">
                From Arijit Singh’s soulful melodies to Karan Aujla and Badshah dance hits.
              </p>
              <div className="card-footer">
                <div className="avatar-group">
                  <div className="avatar avatar-1" style={{ background: '#f59e0b' }}>
                    K
                  </div>
                  <div className="avatar avatar-2" style={{ background: '#ef4444' }}>
                    T
                  </div>
                  <div className="avatar avatar-more">+15</div>
                </div>
                <button
                  className="card-play-btn"
                  style={{ background: '#f59e0b', color: '#000' }}
                  onClick={() => handlePlayCard(bollywoodTrack.id)}
                  aria-label="Play Bollywood Chartbusters"
                >
                  {isPlaying && currentId === bollywoodTrack.id ? (
                    <Pause size={20} fill="#000" />
                  ) : (
                    <Play size={20} fill="#000" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Hollywood Hot 100 */}
          <div
            className="aidj-card ambient-card"
            style={{
              background:
                'linear-gradient(135deg, rgba(26, 5, 51, 0.95) 0%, rgba(45, 10, 107, 0.85) 45%, rgba(10, 26, 61, 0.95) 100%)',
            }}
          >
            <div className="card-bg-gradient ambient-gradient" />
            <div className="card-content">
              <div className="card-tag cyan-tag">
                <span className="live-dot cyan-dot" style={{ background: '#cabeff' }} />
                <span style={{ color: '#cabeff' }}>HOLLYWOOD HOT 100</span>
              </div>
              <h3 className="card-heading">Global Billboard Heat</h3>
              <p className="card-desc">
                Featuring Lady Gaga, Bruno Mars, Sabrina Carpenter, Billie Eilish & Taylor Swift.
              </p>
              <div className="card-footer">
                <div className="avatar-group">
                  <div className="avatar avatar-cyan" style={{ background: '#cabeff' }}>
                    D
                  </div>
                  <div className="avatar avatar-purple" style={{ background: '#8b5cf6' }}>
                    E
                  </div>
                  <div className="avatar avatar-more">+13</div>
                </div>
                <button
                  className="card-play-btn"
                  style={{ background: '#cabeff', color: '#000' }}
                  onClick={() => handlePlayCard(hollywoodTrack.id)}
                  aria-label="Play Hollywood Hot 100"
                >
                  {isPlaying && currentId === hollywoodTrack.id ? (
                    <Pause size={20} fill="#000" />
                  ) : (
                    <Play size={20} fill="#000" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Grid */}
      <section className="aidj-section">
        <div className="section-header">
          <h2 className="section-title">
            <Disc size={20} />
            <span>Recommended Tracks ({recommendedTracks.length})</span>
          </h2>
        </div>

        <div className="recent-cards-grid">
          {recommendedTracks.map((t, idx) => {
            const isThisPlaying = isPlaying && currentId === t.id
            return (
              <div
                key={t.id || idx}
                className={`recent-card ${isThisPlaying ? 'is-playing-card' : ''}`}
                onClick={() => handlePlayCard(t.id)}
              >
                <div className="recent-art-wrap">
                  <div
                    className="recent-art"
                    style={{
                      backgroundImage: t.thumbnail ? `url(${t.thumbnail})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: `hsl(${t.hue || 260}, 60%, 40%)`,
                    }}
                  >
                    {!t.thumbnail && <Disc size={36} color="rgba(255,255,255,0.7)" />}
                  </div>
                  <div className="recent-play-overlay">
                    <div className="recent-play-icon">
                      {isThisPlaying ? (
                        <Pause size={22} fill="#000" />
                      ) : (
                        <Play size={22} fill="#000" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="recent-info">
                  <div className="recent-title">{t.title}</div>
                  <div className="recent-artist">{t.isLive ? 'Live Radio' : t.artist}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
