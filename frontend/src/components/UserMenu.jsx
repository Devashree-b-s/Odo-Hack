import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const name = user?.name || user?.email || 'User'
  const initials = name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2) || 'U'

  return (
    <div className="user-menu">
      <button className="header-user" type="button" onClick={() => setOpen((visible) => !visible)} aria-expanded={open}>
        <span className="user-name">{name}</span><span className="avatar">{initials}</span>
      </button>
      {open && <div className="user-menu-panel"><Link to="/profile" onClick={() => setOpen(false)}>My Profile</Link><button type="button" onClick={logout}>Log Out</button></div>}
    </div>
  )
}
