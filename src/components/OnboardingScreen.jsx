import { useState } from 'react'
import { Sparkles, Disc, ArrowRight, Download, Headphones } from 'lucide-react'
import { WavelengthLogo } from './RealLogos'

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
      <div className="flow-card-wrapper">
        {/* Brand Header */}
        <div className="flow-top-brand">
          <WavelengthLogo size={32} glowing={false} />
          <span className="flow-brand-title">Wavelength</span>
        </div>

        {/* Slide 0 */}
        {slide === 0 && (
          <div className="slide-item fade-in">
            <div className="slide-visual">
              <div className="visual-circle">
                <Disc size={64} className="text-primary" />
              </div>
            </div>
            <div className="slide-typography">
              <h1 className="flow-title">Lossless Audio</h1>
              <p className="flow-subtitle">
                Experience bit-perfect studio quality with rich acoustics and pure detail.
              </p>
            </div>
          </div>
        )}

        {/* Slide 1 */}
        {slide === 1 && (
          <div className="slide-item fade-in">
            <div className="slide-visual">
              <div className="visual-circle">
                <div className="ai-equalizer-bars">
                  <div className="eq-bar bar-1" />
                  <div className="eq-bar bar-2" />
                  <div className="eq-bar bar-3" />
                  <div className="eq-bar bar-4" />
                  <div className="eq-bar bar-5" />
                  <div className="eq-bar bar-6" />
                  <div className="eq-bar bar-7" />
                </div>
              </div>
            </div>
            <div className="slide-typography">
              <h1 className="flow-title">Smart Discovery</h1>
              <p className="flow-subtitle">
                Evolving playlists that adapt to your focus state and musical tastes.
              </p>
            </div>
          </div>
        )}

        {/* Slide 2 */}
        {slide === 2 && (
          <div className="slide-item fade-in">
            <div className="slide-visual">
              <div className="visual-circle">
                <Headphones size={56} className="text-secondary" />
              </div>
            </div>
            <div className="slide-typography">
              <h1 className="flow-title">Live & Offline</h1>
              <p className="flow-subtitle">
                Upload your favorite tracks and tune into live radio broadcasts anytime.
              </p>
            </div>
          </div>
        )}

        {/* Footer & Controls */}
        <div className="flow-footer">
          <div className="flow-dots">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                className={`flow-dot ${i === slide ? 'active' : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flow-btn-stack">
            <button className="flow-primary-btn" onClick={handleNext}>
              <span>{slide === totalSlides - 1 ? 'Get Started' : 'Continue'}</span>
              <ArrowRight size={18} />
            </button>

            <div className="flow-secondary-row">
              {slide < totalSlides - 1 && (
                <button className="flow-secondary-btn" onClick={handleSkip}>
                  Skip
                </button>
              )}

              <button className="flow-download-btn" onClick={onDownload}>
                <Download size={15} />
                <span>About</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
