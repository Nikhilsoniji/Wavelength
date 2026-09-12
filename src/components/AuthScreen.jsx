import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Lock, Mail, Check } from 'lucide-react'
import { WavelengthLogo, GoogleLogo, AppleLogo } from './RealLogos'

export default function AuthScreen({ onComplete }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onComplete()
  }

  return (
    <div className="fullscreen-flow-container">
      <div className="auth-screen-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <WavelengthLogo size={44} glowing={false} />
          </div>
          <h1 className="auth-title">Wavelength</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <div className="auth-body">
          {/* Social Buttons */}
          <div className="social-buttons">
            <button className="social-btn google-btn" onClick={onComplete}>
              <GoogleLogo size={20} />
              <span>Continue with Google</span>
            </button>
            <button className="social-btn apple-btn" onClick={onComplete}>
              <AppleLogo size={20} color="#000000" />
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="name@example.com"
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-toggle">
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                className="toggle-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Instant Guest Access */}
          <div className="guest-footer">
            <button className="guest-btn" onClick={onComplete}>
              <span>Continue as Guest</span>
            </button>
          </div>

          {/* Feature Guarantee */}
          <div className="auth-trust-strip">
            <div className="trust-item">
              <Check size={12} className="text-cyan" /> Lossless Audio
            </div>
            <div className="trust-item">
              <Check size={12} className="text-cyan" /> Live Radio
            </div>
            <div className="trust-item">
              <Check size={12} className="text-cyan" /> No Ads
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
