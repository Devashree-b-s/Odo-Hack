import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { changePasswordRequest } from '../services/authService'

export default function ChangePassword() {
  const navigate = useNavigate(); const { user } = useAuth(); const [currentPassword, setCurrentPassword] = useState(''); const [newPassword, setNewPassword] = useState(''); const [error, setError] = useState('')
  async function submit(event) { event.preventDefault(); try { await changePasswordRequest(currentPassword, newPassword); navigate('/dashboard', { replace: true }) } catch (submitError) { setError(submitError.message) } }
  return <main className="auth-shell"><section className="login-panel"><div className="login-card"><p className="eyebrow">Account security</p><h2>Change your password</h2><p className="login-intro">A password update is required before continuing.</p><form onSubmit={submit}><label>Current password<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label><label>New password<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength="8" required /></label>{error && <p className="form-message is-error" role="alert">{error}</p>}<button className="sign-in-button" type="submit">Update password</button></form><p className="demo-note">Signed in as {user?.email || 'your account'}.</p></div></section></main>
}
