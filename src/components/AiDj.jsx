import { useState } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import { Sparkles, Play, Pause, Disc, Cpu } from 'lucide-react'

const MOOD_FILTERS = ['All', 'Deep Focus', 'Synthwave', 'Ambient Lo-Fi', 'Night Drive', 'Spatial 3D']

export default function AiDj() {
  const library = usePlayerStore((s) => s.library)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentId = usePlayerStore((s) => s.currentId)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)

  const [activeMood, setActiveMood] = useState('All')

  const handlePlayCard = (trackId) => {
    if (currentId === trackId) {
      toggle()
    } else {
      play(trackId)
    }
  }

  const synthwaveTrack = library[0] || {}
  const ambientTrack = library[1] || library[0] || {}

  return (
    <div className="aidj-container">
      {/* Daily Frequency Greeting */}
      <div className="aidj-greeting">
        <div className="aidj-greeting-inner">
          <div className="greeting-badge">
            <Sparkles size={16} className="sparkle-pulse" />
            <span>AI DISCOVERY</span>
          </div>
          <h1 className="greeting-title">AI DJ & Mixes</h1>
          <p className="greeting-subtitle">
            Curated soundscapes that dynamically adapt to your focus state and listening habits.
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
            <Cpu size={20} />
            <span>Curated Mixes</span>
          </h2>
        </div>

        <div className="aidj-cards-grid">
          {/* Card 1: Synthwave Focus */}
          <div className="aidj-card synthwave-card">
            <div className="card-bg-gradient synthwave-gradient" />
            <div className="card-content">
              <div className="card-tag">
                <span className="live-dot" />
                <span>SYNTHWAVE FOCUS</span>
              </div>
              <h3 className="card-heading">Neon Horizons</h3>
              <p className="card-desc">
                A personalized journey through retro-futuristic soundscapes, mixed for deep flow.
              </p>
              <div className="card-footer">
                <div className="avatar-group">
                  <div className="avatar avatar-1">N</div>
                  <div className="avatar avatar-2">W</div>
                  <div className="avatar avatar-more">+3</div>
                </div>
                <button
                  className="card-play-btn synthwave-play"
                  onClick={() => handlePlayCard(synthwaveTrack.id)}
                  aria-label="Play Synthwave"
                >
                  {isPlaying && currentId === synthwaveTrack.id ? (
                    <Pause size={20} fill="#000" />
                  ) : (
                    <Play size={20} fill="#000" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Ambient Drift */}
          <div className="aidj-card ambient-card">
            <div className="card-bg-gradient ambient-gradient" />
            <div className="card-content">
              <div className="card-tag cyan-tag">
                <span className="live-dot cyan-dot" />
                <span>AMBIENT DRIFT</span>
              </div>
              <h3 className="card-heading">Midnight Rain</h3>
              <p className="card-desc">
                Deep sub-bass textures, spatial lo-fi rain acoustics, and soothing frequencies.
              </p>
              <div className="card-footer">
                <div className="avatar-group">
                  <div className="avatar avatar-cyan">M</div>
                  <div className="avatar avatar-purple">83</div>
                </div>
                <button
                  className="card-play-btn ambient-play"
                  onClick={() => handlePlayCard(ambientTrack.id)}
                  aria-label="Play Ambient"
                >
                  {isPlaying && currentId === ambientTrack.id ? (
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
            <span>Recommended Tracks</span>
          </h2>
        </div>

        <div className="recent-cards-grid">
          {library.slice(0, 4).map((t, idx) => {
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
                      background: `linear-gradient(135deg, hsl(${t.hue || 260}, 60%, 40%), hsl(${(t.hue || 260) + 40}, 50%, 20%))`,
                    }}
                  >
                    <Disc size={36} color="rgba(255,255,255,0.7)" />
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
