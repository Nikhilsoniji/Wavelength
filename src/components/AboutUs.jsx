import { useState } from 'react'
import {
  Sparkles,
  Music,
  Radio,
  RadioTower,
  Cpu,
  ShieldCheck,
  Smartphone,
  Github,
  Globe,
  Heart,
  Play,
  Pause,
  ExternalLink,
  Layers,
  Zap,
  Code2,
  Users,
} from 'lucide-react'
import { WavelengthLogo } from './RealLogos'
import { usePlayerStore } from '../store/usePlayerStore'

export default function AboutUs({ onExplore, onOpenRadio, onOpenAiDj }) {
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const currentId = usePlayerStore((s) => s.currentId)
  const play = usePlayerStore((s) => s.play)
  const toggle = usePlayerStore((s) => s.toggle)

  const handlePlaySong = (id) => {
    if (currentId === id) {
      toggle()
    } else {
      play(id)
    }
  }

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-aurora" />
        <div className="about-hero-content">
          <div className="about-logo-wrapper">
            <WavelengthLogo size={68} glowing={true} />
          </div>

          <div className="about-badge-chip">
            <Sparkles size={14} className="sparkle-pulse" />
            <span>ABOUT WAVELENGTH • v1.2.0</span>
          </div>

          <h1 className="about-hero-title">
            Harmonizing Sound, Science & Atmosphere
          </h1>

          <p className="about-hero-subtitle">
            Wavelength is an open, high-fidelity music streaming, spatial audio visualizer,
            and intelligent curation platform designed for audiophiles, creators, and daily listeners.
          </p>

          <div className="about-hero-stats">
            <div className="about-stat-box">
              <span className="stat-number">28+</span>
              <span className="stat-label">Bollywood & Hollywood Hits</span>
            </div>
            <div className="about-stat-box">
              <span className="stat-number">1,000+</span>
              <span className="stat-label">Live Global Radio Stations</span>
            </div>
            <div className="about-stat-box">
              <span className="stat-number">0</span>
              <span className="stat-label">Ads, Trackers & Interruptions</span>
            </div>
            <div className="about-stat-box">
              <span className="stat-number">100%</span>
              <span className="stat-label">Private & Edge-Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Story Card */}
      <section className="about-section">
        <div className="about-story-card">
          <div className="about-story-header">
            <div className="story-badge">
              <Heart size={14} color="#f43f5e" fill="#f43f5e" />
              <span>OUR VISION</span>
            </div>
            <h2 className="story-title">Music Without Walled Gardens</h2>
          </div>
          <p className="story-text">
            Modern music streaming services are locked down with invasive tracking, restrictive paywalls,
            and fragmented catalogs. Wavelength was engineered from the ground up to restore musical freedom.
            We unified official <strong>Bollywood blockbusters</strong>, <strong>Hollywood chartbusters</strong>,
            <strong>global live radio broadcasts</strong>, and <strong>local offline uploads</strong> into one
            reactive, ambient dark interface that runs anywhere: in your desktop browser or natively in your hand
            via Expo mobile.
          </p>
        </div>
      </section>

      {/* Core Architectural Pillars Grid */}
      <section className="about-section">
        <div className="about-section-header">
          <h2 className="about-section-heading">
            <Layers size={22} className="text-cyan" />
            <span>Core Pillars & Capabilities</span>
          </h2>
          <p className="about-section-desc">
            Engineered with modern web and mobile primitives for zero-latency, high-fidelity sound.
          </p>
        </div>

        <div className="about-pillars-grid">
          {/* Pillar 1 */}
          <div className="pillar-card">
            <div className="pillar-icon-box cyan-box">
              <Music size={24} color="#38bdf8" />
            </div>
            <h3 className="pillar-title">Curated Hit Catalog</h3>
            <p className="pillar-desc">
              Instant streaming of the latest verified hits from Arijit Singh, Karan Aujla, Badshah,
              Lady Gaga, Bruno Mars, Sabrina Carpenter, Billie Eilish, and The Weeknd with official HD covers.
            </p>
            <div className="pillar-footer">
              <button
                className="pillar-action-btn"
                onClick={() => handlePlaySong('bw-1')}
              >
                {isPlaying && currentId === 'bw-1' ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
                <span>Play Kesariya</span>
              </button>
              <button
                className="pillar-action-btn"
                onClick={() => handlePlaySong('hw-1')}
              >
                {isPlaying && currentId === 'hw-1' ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
                <span>Play Die With A Smile</span>
              </button>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="pillar-card">
            <div className="pillar-icon-box purple-box">
              <RadioTower size={24} color="#cabeff" />
            </div>
            <h3 className="pillar-title">Live Worldwide Radio</h3>
            <p className="pillar-desc">
              Connect to over a thousand live broadcast frequencies across India, USA, UK, and worldwide.
              Features instant streaming with zero proxy buffering and dynamic bitrate diagnostics.
            </p>
            <div className="pillar-footer">
              <button className="pillar-action-btn" onClick={onOpenRadio}>
                <Radio size={14} />
                <span>Explore Live Radio →</span>
              </button>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="pillar-card">
            <div className="pillar-icon-box amber-box">
              <Cpu size={24} color="#f59e0b" />
            </div>
            <h3 className="pillar-title">Dual-Pipeline Audio Bridge</h3>
            <p className="pillar-desc">
              Seamlessly coordinates HTML5 Web Audio API, WebGL 3D particle visualizers, and background
              streaming without pausing or dropping audio when switching screens or multitasking.
            </p>
            <div className="pillar-footer">
              <button className="pillar-action-btn" onClick={onOpenAiDj}>
                <Sparkles size={14} />
                <span>AI DJ Mixes →</span>
              </button>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="pillar-card">
            <div className="pillar-icon-box green-box">
              <Smartphone size={24} color="#10b981" />
            </div>
            <h3 className="pillar-title">Mobile Everywhere via Expo 57</h3>
            <p className="pillar-desc">
              Runs cross-platform across web, iOS, and Android. Powered by Expo SDK 57 and React Native
              WebView with hardware back-button handling, safe-area adaptation, and haptic feedback.
            </p>
            <div className="pillar-footer">
              <span className="pillar-tag-pill">iOS & Android Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Profile Section */}
      <section className="about-section">
        <div className="about-creator-card">
          <div className="creator-avatar-wrap">
            <div className="creator-avatar">
              <span className="creator-initials">NS</span>
            </div>
            <div className="creator-badge">
              <Zap size={12} fill="#FA2D48" color="#FA2D48" />
            </div>
          </div>

          <div className="creator-details">
            <div className="creator-header-row">
              <div>
                <h3 className="creator-name">Nikhil Soni</h3>
                <span className="creator-role">Lead Architect & Product Engineer</span>
              </div>
              <div className="creator-social-links">
                <a
                  href="https://github.com/Nikhilsoniji"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-link-btn"
                  title="GitHub Profile"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://github.com/Nikhilsoniji/Wavelength"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-link-btn"
                  title="Source Code"
                >
                  <Code2 size={18} />
                  <span>Repository</span>
                </a>
              </div>
            </div>

            <p className="creator-bio">
              Engineered Wavelength to create an uncompromised, aesthetic music haven where modern
              sound engineering meets reactive UI architecture. Built with an obsession for micro-animations,
              ambient light design, and audio-reactive 3D graphics.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Stack Specifications */}
      <section className="about-section">
        <div className="tech-specs-card">
          <h3 className="tech-specs-title">
            <Code2 size={20} className="text-secondary" />
            <span>Engineered With Modern Technology</span>
          </h3>

          <div className="tech-pills-wrap">
            <span className="tech-pill">React 19</span>
            <span className="tech-pill">Vite 5</span>
            <span className="tech-pill">Zustand State Store</span>
            <span className="tech-pill">Expo SDK 57</span>
            <span className="tech-pill">React Native</span>
            <span className="tech-pill">Web Audio API</span>
            <span className="tech-pill">IndexedDB (idb)</span>
            <span className="tech-pill">Radio Browser API</span>
            <span className="tech-pill">Lucide Vector Icons</span>
            <span className="tech-pill">Vercel Edge Network</span>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="about-cta-section">
        <div className="about-cta-content">
          <h2 className="about-cta-title">Ready to Experience Sound in a New Dimension?</h2>
          <p className="about-cta-desc">
            Explore the latest Bollywood and Hollywood hits or tune into your favorite live radio broadcasts.
          </p>
          <div className="about-cta-buttons">
            <button className="cta-primary-btn" onClick={onExplore}>
              <Play size={18} fill="#0a0a0a" />
              <span>Explore Library</span>
            </button>
            <button className="cta-secondary-btn" onClick={onOpenRadio}>
              <Radio size={18} />
              <span>Live Radio Stations</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
