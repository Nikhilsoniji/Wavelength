import { useState } from 'react'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Check,
  AlertCircle,
  LogOut,
  Sparkles,
  Music,
  ShieldCheck,
} from 'lucide-react'
import { WavelengthLogo, GoogleLogo, AppleLogo } from './RealLogos'
import {
  signInLocal,
  signUpLocal,
  signInSocialLocal,
  signInGuest,
} from '../utils/auth'
import { usePlayerStore } from '../store/usePlayerStore'

export default function AuthScreen({ onComplete }) {
  const currentUser = usePlayerStore((s) => s.currentUser)
  const setCurrentUser = usePlayerStore((s) => s.setCurrentUser)
  const logout = usePlayerStore((s) => s.logout)

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSwitching, setIsSwitching] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      let user
      if (isLogin) {
        user = await signInLocal({ email, password })
        setSuccessMessage('Welcome back! Loading your library...')
      } else {
        user = await signUpLocal({ email, password, name })
        setSuccessMessage('Account created successfully in your local database!')
      }
      setCurrentUser(user)
      setTimeout(() => {
        onComplete()
      }, 500)
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider) => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      const user = await signInSocialLocal(provider)
      setCurrentUser(user)
      onComplete()
    } catch (err) {
      setErrorMessage(err.message || 'Social sign-in failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestAccess = async () => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      const user = await signInGuest()
      setCurrentUser(user)
      onComplete()
    } catch (err) {
      setErrorMessage(err.message || 'Guest sign-in failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    logout()
    setIsSwitching(true)
  }

  // If user is already logged in and not explicitly switching accounts
  if (currentUser && !isSwitching) {
    const initial = (currentUser.name || currentUser.email || 'U')[0].toUpperCase()
    const memberSince = currentUser.createdAt
      ? new Date(currentUser.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'Active'

    return (
      <div className="fullscreen-flow-container">
        <div className="auth-screen-card auth-profile-card">
          <div className="auth-header">
            <div className="auth-user-avatar-large">
              <span>{initial}</span>
            </div>
            <h1 className="auth-title">{currentUser.name}</h1>
            <p className="auth-subtitle">{currentUser.email}</p>
          </div>

          <div className="auth-profile-details">
            <div className="profile-detail-row">
              <span className="profile-label">Database Storage</span>
              <span className="profile-val-badge">IndexedDB • Local</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-label">Sign-in Method</span>
              <span className="profile-val-badge text-capitalize">{currentUser.authProvider || 'Email'}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-label">Member Since</span>
              <span className="profile-val">{memberSince}</span>
            </div>
          </div>

          <div className="auth-profile-actions">
            <button className="auth-submit-btn" onClick={onComplete}>
              <span>Continue Listening</span>
              <Music size={18} />
            </button>
            <div className="profile-secondary-actions">
              <button
                type="button"
                className="profile-btn-secondary"
                onClick={() => setIsSwitching(true)}
              >
                Switch Account
              </button>
              <button
                type="button"
                className="profile-btn-danger"
                onClick={handleSignOut}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="auth-trust-strip">
            <div className="trust-item">
              <ShieldCheck size={14} className="text-cyan" /> Secure Client Database
            </div>
            <div className="trust-item">
              <Check size={14} className="text-cyan" /> SHA-256 Hashed
            </div>
          </div>
        </div>
      </div>
    )
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
          <p className="auth-subtitle">
            {isLogin
              ? 'Sign in to access your offline music library'
              : 'Create an account saved to your local database'}
          </p>
        </div>

        <div className="auth-body">
          {/* Notification Messages */}
          {errorMessage && (
            <div className="auth-alert auth-alert-error" role="alert">
              <AlertCircle size={16} className="alert-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert auth-alert-success" role="status">
              <Check size={16} className="alert-icon" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Social One-Click Sign In */}
          <div className="social-buttons">
            <button
              className="social-btn google-btn"
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialSignIn('google')}
            >
              <GoogleLogo size={20} />
              <span>Continue with Google</span>
            </button>
            <button
              className="social-btn apple-btn"
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialSignIn('apple')}
            >
              <AppleLogo size={20} color="#000000" />
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="input-group">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? 'Password' : 'Password (min. 6 characters)'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
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

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="auth-footer-toggle">
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                className="toggle-link"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setErrorMessage('')
                  setSuccessMessage('')
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Instant Guest Access */}
          <div className="guest-footer">
            <button
              type="button"
              className="guest-btn"
              disabled={isLoading}
              onClick={handleGuestAccess}
            >
              <span>Continue as Guest</span>
            </button>
          </div>

          {/* Feature Guarantee & Trust Badges */}
          <div className="auth-trust-strip">
            <div className="trust-item">
              <Check size={12} className="text-cyan" /> Client Database
            </div>
            <div className="trust-item">
              <Check size={12} className="text-cyan" /> SHA-256 Crypto
            </div>
            <div className="trust-item">
              <Check size={12} className="text-cyan" /> Offline-Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
