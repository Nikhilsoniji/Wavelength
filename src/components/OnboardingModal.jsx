import { useState } from 'react'
import { Sparkles, X, ChevronRight, Check, Disc, WifiOff, Music } from 'lucide-react'

export default function OnboardingModal({ isOpen, onClose }) {
  const [slide, setSlide] = useState(0)

  if (!isOpen) return null

  const slides = [
    {
      title: 'Discover Music',
      subtitle: 'Navigate infinite soundscapes. A world of high-fidelity audio curated just for you.',
      tags: ['Ambient', 'Lo-Fi', 'Electronic', 'Spatial 3D'],
      icon: <Disc size={48} className="text-primary" />,
    },
    {
      title: 'Personal Frequencies',
      subtitle: 'Our AI analyzes your listening patterns to generate dynamic, evolving playlists.',
      tags: ['AI Smart Mix', 'Synthwave', 'Deep Focus'],
      icon: <Sparkles size={48} className="text-secondary" />,
    },
    {
      title: 'Anywhere, Anytime',
      subtitle: 'Download your soundscapes in lossless quality. Your music, unbound from the grid.',
      tags: ['Offline Master', '24-Bit FLAC', 'Lossless'],
      icon: <WifiOff size={48} className="text-primary" />,
    },
  ]

  const current = slides[slide]

  return (
    <div className="modal-backdrop">
      <div className="onboarding-modal-card card">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Ambient Glow */}
        <div className="modal-ambient-glow" />

        <div className="onboarding-content">
          <div className="onboarding-illustration">
            <div className="illustration-circle">
              {current.icon}
              <div className="tag-group">
                {current.tags.map((t) => (
                  <span key={t} className="floating-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="onboarding-text">
            <h2 className="onboarding-title">{current.title}</h2>
            <p className="onboarding-subtitle">{current.subtitle}</p>
          </div>

          {/* Dots Pagination */}
          <div className="dots-pagination">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === slide ? 'active' : ''}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="onboarding-actions">
            {slide < slides.length - 1 ? (
              <button className="onboarding-next-btn" onClick={() => setSlide(slide + 1)}>
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button className="onboarding-next-btn finish-btn" onClick={onClose}>
                <Check size={18} />
                <span>Start Listening</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
