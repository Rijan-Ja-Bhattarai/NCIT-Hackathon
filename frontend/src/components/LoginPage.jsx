import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/characters'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = username.trim()

    if (!trimmed) {
      setError('Enter a username to continue.')
      return
    }
    if (!password.trim()) {
      setError('Enter a password to continue.')
      return
    }

    setSubmitting(true)
    setError(null)
    login(trimmed)
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link className="auth-card__back" to="/">
          ← back to home
        </Link>

        <p className="eyebrow">welcome back</p>
        <h1 className="auth-card__title">Sign in to dAy_2</h1>
        <p className="auth-card__subtitle">
          Use any username and password to enter the demo. Your session stays on this device.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Username</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your name"
              disabled={submitting}
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={submitting}
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <button className="btn-pill btn-pill--accent auth-form__submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
