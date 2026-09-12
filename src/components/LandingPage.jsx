import { useState } from 'react'
import {
  ArrowRight,
  Sparkles,
  Download,
  Play,
  Headphones,
  Radio,
  Zap,
  Star,
  CheckCircle2,
  Layers,
  ChevronDown,
} from 'lucide-react'
import {
  WavelengthLogo,
  AppleLogo,
  GooglePlayLogo,
  SpotifyLogo,
  AppleMusicLogo,
  TidalLogo,
  SoundCloudLogo,
  DiscordLogo,
  GithubLogo,
  TwitterXLogo,
} from './RealLogos'

export default function LandingPage({ onBack }) {
  const [activeCompareMode, setActiveCompareMode] = useState('lossless')

  return (
    <div className="landing-page-root">
      {/* Navigation */}
      <header className="landing-navbar">
        <div className="landing-nav-container">
          <div className="landing-brand" onClick={onBack} role="button" tabIndex={0}>
            <WavelengthLogo size={32} glowing={false} />
            <div className="brand-text">
              <span className="brand-name">Wavelength</span>
              <span className="brand-tagline">MUSIC PLAYER</span>
            </div>
          </div>

          <nav className="landing-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#compare" className="nav-link">Audio Quality</a>
            <a href="#platforms" className="nav-link">Download</a>
            <a href="#reviews" className="nav-link">Reviews</a>
          </nav>

          <div className="landing-nav-actions">
            <button className="nav-btn-hollow" onClick={onBack}>
              Sign In
            </button>
            <button className="nav-btn-primary" onClick={onBack}>
              <span>Launch App</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-grid-layout">
          <div className="hero-text-content">
            <div className="hero-badge-pill">
              <Sparkles size={14} />
              <span>THE NEXT GENERATION OF AUDIO</span>
            </div>

            <h1 className="hero-main-heading">
              Feel Every <span className="gradient-text-sonic">Frequency.</span><br />
              Music in <span className="gradient-text-aurora">Pure Clarity.</span>
            </h1>

            <p className="hero-subtext">
              Wavelength redefines your listening experience with studio-grade lossless playback,
              AI generative soundscapes, and live radio streams worldwide.
            </p>

            <div className="hero-cta-group">
              <button className="hero-btn-primary" onClick={onBack}>
                <Play size={18} fill="currentColor" />
                <span>Open Player</span>
              </button>
              <a href="#platforms" className="hero-btn-secondary">
                <Download size={18} />
                <span>Get App</span>
              </a>
            </div>

            <div className="hero-metrics-strip">
              <div className="metric-box">
                <span className="metric-val">24-Bit</span>
                <span className="metric-lbl">Studio Lossless</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-val">192 kHz</span>
                <span className="metric-lbl">Sample Rate</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-val">0.00%</span>
                <span className="metric-lbl">Compression Loss</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-val">360°</span>
                <span className="metric-lbl">Spatial Audio</span>
              </div>
            </div>
          </div>
        </div>

        <a href="#brand-strip" className="hero-scroll-cue" aria-label="Scroll to content">
          <ChevronDown size={22} />
        </a>
      </section>

      {/* Partner Strip */}
      <section id="brand-strip" className="brand-partners-strip">
        <div className="brand-strip-inner">
          <span className="brand-strip-label">DESIGNED FOR SEAMLESS INTEGRATION:</span>
          <div className="brand-logos-row">
            <div className="brand-logo-item">
              <AppleMusicLogo size={22} />
              <span>Apple Music</span>
            </div>
            <div className="brand-logo-item">
              <SpotifyLogo size={22} />
              <span>Spotify Connect</span>
            </div>
            <div className="brand-logo-item">
              <TidalLogo size={20} />
              <span>TIDAL</span>
            </div>
            <div className="brand-logo-item">
              <SoundCloudLogo size={20} />
              <span>SoundCloud</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sound Quality A/B Test */}
      <section id="compare" className="sound-compare-section">
        <div className="section-head">
          <span className="section-eyebrow">AUDITORY COMPARISON</span>
          <h2 className="section-title">Hear the Uncompressed Difference</h2>
          <p className="section-desc">
            Compare standard compressed streaming with Wavelength 24-bit studio sound.
          </p>
        </div>

        <div className="compare-interactive-card">
          <div className="compare-tabs">
            <button
              className={`compare-tab ${activeCompareMode === 'standard' ? 'active-standard' : ''}`}
              onClick={() => setActiveCompareMode('standard')}
            >
              <div className="tab-title">Standard Streaming</div>
              <div className="tab-sub">128 kbps MP3 • Compressed</div>
            </button>

            <button
              className={`compare-tab ${activeCompareMode === 'lossless' ? 'active-lossless' : ''}`}
              onClick={() => setActiveCompareMode('lossless')}
            >
              <div className="tab-badge">LOSSLESS</div>
              <div className="tab-title">Wavelength Master</div>
              <div className="tab-sub">9,216 kbps • 24-Bit / 192kHz FLAC</div>
            </button>
          </div>

          <div className="compare-metrics-display">
            <div className="spectrum-visualizer-mock">
              <div className="spectrum-bars">
                {Array.from({ length: 36 }).map((_, i) => {
                  const height = activeCompareMode === 'lossless'
                    ? Math.sin(i * 0.4) * 45 + 50
                    : Math.max(10, Math.sin(i * 0.4) * 20 + 25)
                  return (
                    <div
                      key={i}
                      className={`spectrum-bar ${activeCompareMode === 'lossless' ? 'lossless-bar' : 'standard-bar'}`}
                      style={{ height: `${height}%` }}
                    />
                  )
                })}
              </div>
            </div>

            <div className="compare-stats-grid">
              <div className="c-stat">
                <span className="c-label">Dynamic Range</span>
                <span className="c-val">{activeCompareMode === 'lossless' ? '144 dB (Studio Max)' : '96 dB (Clipped)'}</span>
              </div>
              <div className="c-stat">
                <span className="c-label">Frequency Response</span>
                <span className="c-val">{activeCompareMode === 'lossless' ? '10 Hz - 96,000 Hz' : '20 Hz - 16,000 Hz'}</span>
              </div>
              <div className="c-stat">
                <span className="c-label">Spatial Precision</span>
                <span className="c-val">{activeCompareMode === 'lossless' ? '3D Spatial Acoustic Model' : 'Flat 2D Stereo'}</span>
              </div>
              <div className="c-stat">
                <span className="c-label">Harmonic Distortion</span>
                <span className="c-val">{activeCompareMode === 'lossless' ? '< 0.0001% THD+N' : '> 1.2% THD+N'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-grid-section">
        <div className="section-head">
          <span className="section-eyebrow">FEATURES</span>
          <h2 className="section-title">Engineered for Music Lovers</h2>
          <p className="section-desc">Every element of Wavelength is designed to deliver pure musical enjoyment.</p>
        </div>

        <div className="features-cards-container">
          {[
            {
              icon: <Zap size={24} className="text-cyan" />,
              badge: 'LOSSLESS',
              title: '24-Bit / 192kHz Audio',
              desc: 'Stream music in bit-perfect studio quality with zero compression artifacts.',
              color: 'var(--accent)',
            },
            {
              icon: <Sparkles size={24} className="text-purple" />,
              badge: 'AI CURATION',
              title: 'Smart Discovery & Mixes',
              desc: 'Personalized generative soundscapes that adapt to your listening habits and mood.',
              color: '#8b5cf6',
            },
            {
              icon: <Headphones size={24} className="text-pink" />,
              badge: 'SPATIAL',
              title: 'Immersive Soundstage',
              desc: 'Binaural acoustic rendering simulating multi-speaker fidelity through your headphones.',
              color: '#ec4899',
            },
            {
              icon: <Radio size={24} className="text-amber" />,
              badge: 'GLOBAL',
              title: 'Live Worldwide Radio',
              desc: 'Direct live streams of premier stations and international broadcasts.',
              color: '#f59e0b',
            },
            {
              icon: <Download size={24} className="text-emerald" />,
              badge: 'LOCAL',
              title: 'Custom Uploads',
              desc: 'Upload your own audio library for seamless playback with persistent storage.',
              color: '#10b981',
            },
            {
              icon: <Layers size={24} className="text-blue" />,
              badge: 'DESIGN',
              title: 'Refined 2D Interface',
              desc: 'Clean, elegant Apple Music-inspired player interface with fluid interactions.',
              color: '#38bdf8',
            },
          ].map((f) => (
            <div key={f.title} className="feature-glass-card">
              <div className="card-top-row">
                <div className="feature-icon-box" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                  {f.icon}
                </div>
                <span className="feature-badge" style={{ color: f.color, borderColor: 'var(--border)' }}>
                  {f.badge}
                </span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="download-platforms-section">
        <div className="section-head">
          <span className="section-eyebrow">PLATFORMS</span>
          <h2 className="section-title">Available Everywhere</h2>
          <p className="section-desc">Optimized for mobile, desktop, and web.</p>
        </div>

        <div className="download-cards-grid">
          {/* iOS Card */}
          <div className="download-card" onClick={onBack}>
            <div className="dl-icon-wrap">
              <AppleLogo size={36} color="#FFFFFF" />
            </div>
            <div className="dl-info">
              <div className="dl-label">Apple Ecosystem</div>
              <div className="dl-store-title">App Store</div>
              <div className="dl-specs">iOS • iPadOS • macOS</div>
            </div>
            <div className="dl-rating">
              <div className="stars-row">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span>4.9 / 5.0 (24k ratings)</span>
            </div>
            <button className="dl-action-btn">
              <span>Open App</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Android Card */}
          <div className="download-card featured-dl-card" onClick={onBack}>
            <div className="featured-badge">FEATURED</div>
            <div className="dl-icon-wrap">
              <GooglePlayLogo size={36} />
            </div>
            <div className="dl-info">
              <div className="dl-label">Android</div>
              <div className="dl-store-title">Google Play</div>
              <div className="dl-specs">Android 10+ • Lossless Support</div>
            </div>
            <div className="dl-rating">
              <div className="stars-row">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span>4.8 / 5.0 (180k reviews)</span>
            </div>
            <button className="dl-action-btn primary-dl-btn">
              <span>Open App</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Web Player Card */}
          <div className="download-card" onClick={onBack}>
            <div className="dl-icon-wrap">
              <WavelengthLogo size={36} glowing={false} />
            </div>
            <div className="dl-info">
              <div className="dl-label">Browser</div>
              <div className="dl-store-title">Web Studio</div>
              <div className="dl-specs">Chrome • Safari • Firefox • Edge</div>
            </div>
            <div className="dl-rating">
              <div className="badge-instant">NO INSTALLATION NEEDED</div>
            </div>
            <button className="dl-action-btn">
              <span>Launch Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="reviews-section">
        <div className="section-head">
          <span className="section-eyebrow">REVIEWS</span>
          <h2 className="section-title">Loved by Listeners</h2>
        </div>

        <div className="reviews-cards-grid">
          {[
            {
              name: 'Arjun Mehta',
              role: 'Music Producer',
              text: 'The sound quality is astonishing. The lossless audio makes every subtle detail stand out.',
              rating: 5,
            },
            {
              name: 'Priya Sharma',
              role: 'Sound Architect & DJ',
              text: 'The clean Apple Music-inspired interface is so refreshing and easy to navigate.',
              rating: 5,
            },
            {
              name: 'Dr. Rohan Kapoor',
              role: 'Acoustics Researcher',
              text: 'Exceptional playback engine with responsive controls and excellent live radio streaming.',
              rating: 5,
            },
          ].map((r) => (
            <div key={r.name} className="review-card">
              <div className="review-stars">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                ))}
                <span className="verified-badge">
                  <CheckCircle2 size={13} className="text-cyan" /> Verified Listener
                </span>
              </div>
              <p className="review-quote">"{r.text}"</p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">{r.name[0]}</div>
                <div>
                  <div className="reviewer-name">{r.name}</div>
                  <div className="reviewer-role">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-master-banner">
        <div className="cta-content">
          <WavelengthLogo size={48} glowing={false} />
          <h2 className="cta-heading">Ready to Experience Sound in High Fidelity?</h2>
          <p className="cta-sub">
            Join thousands of listeners streaming lossless music worldwide.
          </p>
          <div className="cta-buttons-row">
            <button className="cta-btn-launch" onClick={onBack}>
              <Play size={18} fill="currentColor" />
              <span>Launch Web Player</span>
            </button>
            <a href="#platforms" className="cta-btn-dl">
              <Download size={18} />
              <span>Get the App</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer-bar">
        <div className="footer-content-wrap">
          <div className="footer-brand-side">
            <div className="f-logo-row">
              <WavelengthLogo size={28} glowing={false} />
              <span className="f-brand-title">Wavelength</span>
            </div>
            <p className="f-desc">Next-generation audio platform and lossless streaming engine.</p>
            <div className="f-social-row">
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="f-social-icon" aria-label="Discord">
                <DiscordLogo size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="f-social-icon" aria-label="GitHub">
                <GithubLogo size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="f-social-icon" aria-label="Twitter">
                <TwitterXLogo size={16} />
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="f-col">
              <h4>Audio</h4>
              <a href="#features">Lossless FLAC</a>
              <a href="#features">Spatial Audio</a>
              <a href="#features">AI Discovery</a>
              <a href="#features">Live Radio</a>
            </div>
            <div className="f-col">
              <h4>Platforms</h4>
              <a href="#platforms">iOS App</a>
              <a href="#platforms">Android App</a>
              <a href="#platforms">Web Player</a>
            </div>
            <div className="f-col">
              <h4>About</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-line">
          <span>© 2026 Wavelength Audio. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
