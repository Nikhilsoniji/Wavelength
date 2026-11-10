import { useState } from 'react'
import {
  X,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  AlertCircle,
  Check,
  LogOut,
  Music,
} from 'lucide-react'
import {
  signInLocal,
  signUpLocal,
  signInSocialLocal,
  signInGuest,
} from '../utils/auth'
import { usePlayerStore } from '../store/usePlayerStore'

export default function AuthModal({ isOpen, onClose }) {
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

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      let user
      if (isLogin) {
        user = await signInLocal({ email, password })
        setSuccessMessage('Logged in successfully!')
      } else {
        user = await signUpLocal({ email, password, name })
        setSuccessMessage('Account created and saved to local database!')
      }
      setCurrentUser(user)
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed.')
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
      onClose()
    } catch (err) {
      setErrorMessage(err.message || 'Social sign-in failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuest = async () => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      const user = await signInGuest()
      setCurrentUser(user)
      onClose()
    } catch (err) {
      setErrorMessage(err.message || 'Guest sign-in failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {currentUser && !isSwitching ? (
          <div className="auth-profile-modal-view">
            <div className="auth-header">
              <div className="auth-user-avatar-large">
                <span>{(currentUser.name || currentUser.email || 'U')[0].toUpperCase()}</span>
              </div>
              <h2 className="auth-title">{currentUser.name}</h2>
              <p className="auth-subtitle">{currentUser.email}</p>
            </div>

            <div className="auth-profile-details">
              <div className="profile-detail-row">
                <span className="profile-label">Database</span>
                <span className="profile-val-badge">IndexedDB Local</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-label">Provider</span>
                <span className="profile-val-badge text-capitalize">{currentUser.authProvider || 'Email'}</span>
              </div>
            </div>

            <div className="auth-profile-actions">
              <button className="auth-submit-btn" onClick={onClose}>
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
                  onClick={() => {
                    logout()
                    setIsSwitching(true)
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <div className="auth-logo-badge">
                <Sparkles size={28} className="text-primary" />
              </div>
              <h2 className="auth-title">Wavelength 3D</h2>
              <p className="auth-subtitle">
                {isLogin ? 'Sign in to your local account' : 'Create an offline-first account'}
              </p>
            </div>

            <div className="auth-body">
              {errorMessage && (
                <div className="auth-alert auth-alert-error" role="alert">
                  <AlertCircle size={15} className="alert-icon" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="auth-alert auth-alert-success" role="status">
                  <Check size={15} className="alert-icon" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="social-buttons">
                <button
                  type="button"
                  className="social-btn google-btn"
                  disabled={isLoading}
                  onClick={() => handleSocialSignIn('google')}
                >
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
                <button
                  type="button"
                  className="social-btn apple-btn"
                  disabled={isLoading}
                  onClick={() => handleSocialSignIn('apple')}
                >
                  <span> Continue with Apple</span>
                </button>
              </div>

              <div className="auth-divider">
                <span>or log in with email</span>
              </div>

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
                    />
                  </div>
                )}

                <div className="input-group">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
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

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>{isLogin ? 'Log in' : 'Create Account'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer-toggle">
                <p>
                  {isLogin ? 'New here?' : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    className="toggle-link"
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setErrorMessage('')
                      setSuccessMessage('')
                    }}
                  >
                    {isLogin ? 'Create an account' : 'Log in'}
                  </button>
                </p>
              </div>

              <div className="guest-footer">
                <button
                  type="button"
                  className="guest-btn"
                  disabled={isLoading}
                  onClick={handleGuest}
                >
                  <span>Continue as Guest</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
