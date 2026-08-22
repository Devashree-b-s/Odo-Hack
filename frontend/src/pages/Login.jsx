import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!identifier.trim() || !password) {
      setError('Enter your Login ID and password to continue.')
      return
    }

    const result = login(identifier, password)
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <main className="auth-shell">
      <section className="brand-panel" aria-label="Dayflow introduction">
        <div className="brand-mark">D</div>
        <div>
          <p className="eyebrow">People operations, in flow</p>
          <h1>Dayflow</h1>
          <p className="brand-copy">
            A calmer way to manage every working day.
          </p>
        </div>
        <div className="brand-footer">Human resources, thoughtfully connected.</div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-brand"><span className="brand-mark">D</span> Dayflow</div>
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="login-intro">Use your company credentials to continue.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-id">Email or Login ID</label>
            <input
              id="login-id"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="you@company.com"
              autoComplete="username"
              autoFocus
            />

            <div className="field-heading">
              <label htmlFor="password">Password</label>
              <button type="button" className="text-button" onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <div className={`form-message ${error ? 'is-error' : ''}`} role="alert" aria-live="polite">
              {error}
            </div>
            <button className="sign-in-button" type="submit">Sign In <span aria-hidden="true">-&gt;</span></button>
          </form>

          <p className="demo-note">Demo access: use `hr@dayflow.demo` or `employee@dayflow.demo` with `Dayflow123!`.</p>
        </div>
      </section>
    </main>
  )
}
