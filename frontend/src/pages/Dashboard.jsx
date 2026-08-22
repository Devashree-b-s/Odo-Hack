import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const isAdmin = user.role === 'HR_ADMIN'

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div className="dashboard-brand"><span className="brand-mark small">D</span> Dayflow</div>
        <button className="logout-button" type="button" onClick={logout}>Log out</button>
      </header>
      <section className="dashboard-content">
        <p className="eyebrow">{isAdmin ? 'HR administration' : 'Employee workspace'}</p>
        <h1>{isAdmin ? 'Admin Dashboard' : 'Employee Dashboard'}</h1>
        <p className="welcome-copy">Welcome, {user.name}. Your Dayflow workspace is ready.</p>
        <div className="dashboard-placeholder">
          <span className="placeholder-icon" aria-hidden="true">+</span>
          <div>
            <h2>Your workspace is taking shape</h2>
            <p>{isAdmin ? 'People, attendance, and payroll tools will appear here.' : 'Your attendance, leave, and profile tools will appear here.'}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
