import { useState } from 'react'
import { X, Sparkles, LogIn, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="auth-modal-card card">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sparkles size={28} className="text-primary" />
          </div>
          <h2 className="auth-title">Wavelength 3D</h2>
          <p className="auth-subtitle">High fidelity audio. Immersive discovery.</p>
        </div>

        <div className="auth-body">
          <div className="social-buttons">
            <button className="social-btn google-btn" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.3-.8-.4-1.7-.4-2.8 0-1 .2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12c0 1.7.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
            <button className="social-btn apple-btn" onClick={onClose}>
              <span> Continue with Apple</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or log in with email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>{isLogin ? 'Log in' : 'Create Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-toggle">
            <p>
              {isLogin ? 'New here?' : 'Already have an account?'}{' '}
              <button
                type="button"
                className="toggle-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Create an account' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
