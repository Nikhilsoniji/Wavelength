import { useState } from 'react'
import { Sparkles, Disc, WifiOff, ArrowRight, Download } from 'lucide-react'

export default function OnboardingScreen({ onComplete, onDownload }) {
  const [slide, setSlide] = useState(0)

  const totalSlides = 3

  const handleNext = () => {
    if (slide < totalSlides - 1) {
      setSlide(slide + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fullscreen-flow-container">
      {/* Ambient Radial Background */}
      <div className="flow-ambient-bg">
        <div className="ambient-blob blob-1" />
        <div className="ambient-blob blob-2" />
      </div>

      <div className="flow-card-wrapper">
        {/* Slide Content */}
        {slide === 0 && (
          <div className="slide-item fade-in">
            <div className="slide-visual">
              <div className="visual-circle">
                <Disc size={64} className="text-primary spin-slow" />
                <span className="visual-tag tag-top">Ambient</span>
                <span className="visual-tag tag-bottom">Lo-Fi</span>
                <span className="visual-tag tag-left">Electronic</span>
              </div>
            </div>
            <div className="slide-typography">
              <h1 className="flow-title">Discover Music</h1>
              <p className="flow-subtitle">
                Navigate infinite soundscapes. A world of high-fidelity audio curated just for you.
              </p>
            </div>
          </div>
        )}

        {slide === 1 && (
          <div className="slide-item fade-in">
            <div className="slide-visual">
              <div className="visual-circle ai-border-glow">
                <div className="ai-equalizer-bars">
                  <div className="eq-bar bar-1" />
                  <div className="eq-bar bar-2" />
                  <div className="eq-bar bar-3" />
                  <div className="eq-bar bar-4" />
                  <div className="eq-bar bar-5" />
                </div>
                <div className="sparkle-badge">
                  <Sparkles size={20} className="text-primary" />
                </div>
              </div>
            </div>
            <div className="slide-typography">
              <h1 className="flow-title">Personal Frequencies</h1>
              <p className="flow-subtitle">
                Our AI analyzes your listening patterns to generate dynamic, evolving playlists.
              </p>
            </div>
          </div>
        )}

        {slide === 2 && (
          <div className="slide-item fade-in">
            <div className="slide-visual">
              <div className="visual-circle offline-circle">
                <WifiOff size={56} className="text-secondary" />
                <div className="ripple-ring ring-1" />
                <div className="ripple-ring ring-2" />
              </div>
            </div>
            <div className="slide-typography">
              <h1 className="flow-title">Anywhere, Anytime</h1>
              <p className="flow-subtitle">
                Download your soundscapes in 24-bit lossless quality. Your music, unbound from the grid.
              </p>
            </div>
          </div>
        )}

        {/* Footer & Controls */}
        <div className="flow-footer">
          <div className="flow-dots">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <span
                key={i}
                className={`flow-dot ${i === slide ? 'active' : ''}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>

          <div className="flow-btn-stack">
            <button className="flow-primary-btn" onClick={handleNext}>
              <span>{slide === totalSlides - 1 ? 'Get Started' : 'Continue'}</span>
              <ArrowRight size={18} />
            </button>

            {slide < totalSlides - 1 && (
              <button className="flow-secondary-btn" onClick={handleSkip}>
                Skip to Login
              </button>
            )}

            <button className="flow-download-btn" onClick={onDownload}>
              <Download size={16} />
              <span>Download App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
