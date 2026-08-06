import { ArrowRight, Music, Zap, Wifi, Star, Download, Apple, Play, Headphones, Radio, Sparkles, ChevronDown } from 'lucide-react'

export default function LandingPage({ onBack }) {
  return (
    <div className="landing-page">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <div className="landing-logo">W</div>
          <span className="landing-nav-title">Wavelength</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#platforms" className="landing-nav-link">Platforms</a>
          <a href="#reviews" className="landing-nav-link">Reviews</a>
        </div>
        <button className="landing-nav-cta" onClick={onBack}>
          Open App →
        </button>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-bg">
          <div className="lp-blob lp-blob-1" />
          <div className="lp-blob lp-blob-2" />
          <div className="lp-blob lp-blob-3" />
        </div>

        <div className="landing-hero-content">
          <div className="landing-badge">
            <Sparkles size={14} />
            <span>AI-Powered Music Experience</span>
          </div>

          <h1 className="landing-hero-title">
            Your Music.<br />
            <span className="landing-gradient-text">Reimagined.</span>
          </h1>

          <p className="landing-hero-subtitle">
            Navigate infinite soundscapes in immersive 24-bit lossless audio.
            AI DJ, spatial sound, offline downloads — all in one place.
          </p>

          <div className="landing-hero-actions">
            <a href="#platforms" className="landing-primary-btn">
              <Download size={18} />
              Download Free
            </a>
            <button className="landing-secondary-btn" onClick={onBack}>
              <Play size={16} fill="currentColor" />
              Try Web App
            </button>
          </div>

          <div className="landing-hero-stats">
            <div className="stat-item">
              <span className="stat-number">50M+</span>
              <span className="stat-label">Tracks</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">24-bit</span>
              <span className="stat-label">Lossless</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">AI DJ</span>
              <span className="stat-label">Powered</span>
            </div>
          </div>
        </div>

        <div className="landing-hero-visual">
          <div className="lp-vinyl-outer">
            <div className="lp-vinyl-ring ring-a" />
            <div className="lp-vinyl-ring ring-b" />
            <div className="lp-vinyl-ring ring-c" />
            <div className="lp-vinyl-disc">
              <div className="lp-vinyl-center">
                <Music size={32} />
              </div>
            </div>
          </div>
          <div className="lp-floating-card card-1">
            <Headphones size={16} />
            <span>Spatial Audio</span>
          </div>
          <div className="lp-floating-card card-2">
            <Zap size={16} />
            <span>AI Curated</span>
          </div>
          <div className="lp-floating-card card-3">
            <Wifi size={16} />
            <span>Offline Mode</span>
          </div>
        </div>

        <a href="#features" className="landing-scroll-hint">
          <ChevronDown size={20} />
        </a>
      </section>

      {/* Features */}
      <section id="features" className="landing-features">
        <div className="landing-section-header">
          <span className="landing-section-tag">Why Wavelength</span>
          <h2 className="landing-section-title">Everything music should be</h2>
          <p className="landing-section-sub">Built for audiophiles, powered by AI, designed for you.</p>
        </div>

        <div className="landing-features-grid">
          {[
            {
              icon: <Music size={28} />,
              title: 'Lossless 24-bit Audio',
              desc: 'Experience music exactly as the artist intended. No compression, no compromise — pure studio-quality sound.',
              color: '#a855f7',
            },
            {
              icon: <Sparkles size={28} />,
              title: 'AI DJ Mode',
              desc: 'Your personal AI DJ that reads the room. Generates dynamic, evolving playlists based on your mood and listening patterns.',
              color: '#3b82f6',
            },
            {
              icon: <Radio size={28} />,
              title: 'Live Radio Streams',
              desc: 'Thousands of curated live radio stations from around the world. Always something new playing.',
              color: '#ec4899',
            },
            {
              icon: <Download size={28} />,
              title: 'Offline Downloads',
              desc: 'Download your favorite soundscapes and listen anywhere — no internet required. Your music, unbound.',
              color: '#10b981',
            },
            {
              icon: <Zap size={28} />,
              title: '3D Spatial Sound',
              desc: 'Immersive 3D audio that places instruments in space around you. Feel music like never before.',
              color: '#f59e0b',
            },
            {
              icon: <Headphones size={28} />,
              title: 'Smart Queue',
              desc: 'Intelligent queue management that learns your preferences. Drag, drop, and organize effortlessly.',
              color: '#06b6d4',
            },
          ].map((f) => (
            <div key={f.title} className="landing-feature-card">
              <div className="lf-icon" style={{ '--feat-color': f.color }}>
                {f.icon}
              </div>
              <h3 className="lf-title">{f.title}</h3>
              <p className="lf-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms / Download */}
      <section id="platforms" className="landing-platforms">
        <div className="lp-platforms-glow" />
        <div className="landing-section-header">
          <span className="landing-section-tag">Available Everywhere</span>
          <h2 className="landing-section-title">Download Wavelength</h2>
          <p className="landing-section-sub">Free to start. Premium for audiophiles.</p>
        </div>

        <div className="landing-download-cards">
          <div className="ldc-card">
            <div className="ldc-icon">
              <Apple size={36} />
            </div>
            <div className="ldc-info">
              <div className="ldc-sub">Download on the</div>
              <div className="ldc-platform">App Store</div>
            </div>
            <div className="ldc-badge">iOS 16+</div>
          </div>

          <div className="ldc-card ldc-featured">
            <div className="ldc-icon">
              <Play size={36} fill="currentColor" />
            </div>
            <div className="ldc-info">
              <div className="ldc-sub">Get it on</div>
              <div className="ldc-platform">Google Play</div>
            </div>
            <div className="ldc-badge ldc-badge-primary">Android 10+</div>
          </div>

          <div className="ldc-card" onClick={onBack} style={{ cursor: 'pointer' }}>
            <div className="ldc-icon">
              <Music size={36} />
            </div>
            <div className="ldc-info">
              <div className="ldc-sub">Launch in</div>
              <div className="ldc-platform">Web Browser</div>
            </div>
            <div className="ldc-badge ldc-badge-green">Available Now</div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="landing-reviews">
        <div className="landing-section-header">
          <span className="landing-section-tag">Loved by Listeners</span>
          <h2 className="landing-section-title">What people are saying</h2>
        </div>

        <div className="landing-reviews-grid">
          {[
            { name: 'Arjun M.', handle: '@arjunbeats', text: 'The AI DJ feature is insane. It knows exactly what I want to hear before I do. Never going back to Spotify.', stars: 5 },
            { name: 'Priya S.', handle: '@priyamusic', text: 'The 24-bit lossless quality is a game changer. I can hear details in songs I\'ve listened to hundreds of times.', stars: 5 },
            { name: 'Rohan K.', handle: '@rohan3d', text: 'The 3D vinyl deck UI alone is worth it. But the offline mode + radio combo seals the deal. 10/10.', stars: 5 },
          ].map((r) => (
            <div key={r.name} className="landing-review-card">
              <div className="lrc-stars">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="lrc-text">"{r.text}"</p>
              <div className="lrc-author">
                <div className="lrc-avatar">{r.name[0]}</div>
                <div>
                  <div className="lrc-name">{r.name}</div>
                  <div className="lrc-handle">{r.handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="landing-cta-footer">
        <div className="lp-blob lp-blob-cta" />
        <h2 className="landing-cta-title">Ready to hear the difference?</h2>
        <p className="landing-cta-sub">Join over 2 million listeners. Free forever, premium for those who demand more.</p>
        <div className="landing-cta-btns">
          <a href="#platforms" className="landing-primary-btn">
            <Download size={18} />
            Download Now
          </a>
          <button className="landing-secondary-btn" onClick={onBack}>
            Open Web App
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <div className="landing-logo">W</div>
          <span>Wavelength © 2026</span>
        </div>
        <div className="landing-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
          <a href="#">Blog</a>
        </div>
      </footer>
    </div>
  )
}
