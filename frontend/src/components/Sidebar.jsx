import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: '⌂', roles: ['HR_ADMIN', 'EMPLOYEE'] },
  { label: 'Employees', path: '/employees', icon: '◎', roles: ['HR_ADMIN'] },
  { label: 'Attendance', path: '/attendance', icon: '◷', roles: ['HR_ADMIN', 'EMPLOYEE'] },
  { label: 'Time Off', path: '/time-off', icon: '◌', roles: ['HR_ADMIN', 'EMPLOYEE'] },
  { label: 'Profile', path: '/profile', icon: '○', roles: ['HR_ADMIN', 'EMPLOYEE'] },
]

export default function Sidebar() {
  const { role } = useAuth()
  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><span className="brand-mark">D</span><span>Dayflow</span></div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.filter((item) => item.roles.includes(role)).map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">Your people workspace<br />is in flow.</div>
    </aside>
  )
}
