import { usePlayerStore } from '../store/usePlayerStore'
import { Sparkles, Play, Pause, Radio, Music, Flame, Zap, Disc } from 'lucide-react'

export default function AiDj() {
  const library = usePlayerStore((s) => s.library)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentId = usePlayerStore((s) => s.currentId)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)

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
        <div className="greeting-badge">
          <Sparkles size={16} className="sparkle-pulse" />
          <span>STITCH AI MUSIC ENGINE</span>
        </div>
        <h1 className="greeting-title">Good Morning</h1>
        <p className="greeting-subtitle">Here is your daily frequency and personalized AI mix.</p>
      </div>

      {/* AI Recommended Section */}
      <section className="aidj-section">
        <div className="section-header">
          <h2 className="section-title">
            <Sparkles size={20} className="text-accent-purple" />
            <span>AI Recommended Mixes</span>
          </h2>
          <span className="badge-live-ai">HIGH FIDELITY</span>
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
                A personalized journey through retro-futuristic soundscapes, mixed for deep focus.
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
                >
                  {isPlaying && currentId === synthwaveTrack.id ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={20} fill="currentColor" />
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
                Deep textures and lo-fi spatial audio beats designed to enhance clarity & relaxation.
              </p>
              <div className="card-footer">
                <div className="avatar-group">
                  <div className="avatar avatar-cyan">M</div>
                  <div className="avatar avatar-purple">83</div>
                </div>
                <button
                  className="card-play-btn ambient-play"
                  onClick={() => handlePlayCard(ambientTrack.id)}
                >
                  {isPlaying && currentId === ambientTrack.id ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={20} fill="currentColor" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Played / Frequency Grid */}
      <section className="aidj-section">
        <div className="section-header">
          <h2 className="section-title">
            <Disc size={20} className="text-accent-cyan" />
            <span>Recently Played Frequencies</span>
          </h2>
        </div>

        <div className="recent-cards-grid">
          {library.slice(0, 4).map((t, idx) => {
            const titles = ['Dark Matter', 'Night Drive', 'Resonance', 'Tape Loops']
            const artists = ['The Void', 'Kavinsky', 'HOME', 'Lorn']
            const cardTitle = titles[idx] || t.title
            const cardArtist = artists[idx] || t.artist

            return (
              <div
                key={t.id || idx}
                className="recent-card card"
                onClick={() => handlePlayCard(t.id)}
              >
                <div className="recent-art-wrap">
                  <div
                    className="recent-art"
                    style={{
                      background: `linear-gradient(135deg, hsl(${t.hue || 260}, 80%, 45%), hsl(${(t.hue || 260) + 60}, 90%, 25%))`,
                    }}
                  >
                    <Disc size={36} color="rgba(255,255,255,0.7)" />
                  </div>
                  <div className="recent-play-overlay">
                    <div className="recent-play-icon">
                      {isPlaying && currentId === t.id ? (
                        <Pause size={22} fill="currentColor" />
                      ) : (
                        <Play size={22} fill="currentColor" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="recent-info">
                  <div className="recent-title">{cardTitle}</div>
                  <div className="recent-artist">{cardArtist}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
