import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)

  return (
    <div className="user-menu">
      <button className="header-user" type="button" onClick={() => setOpen((visible) => !visible)} aria-expanded={open}>
        <span className="user-name">{user.name}</span><span className="avatar">{initials}</span>
      </button>
      {open && <div className="user-menu-panel"><Link to="/profile" onClick={() => setOpen(false)}>My Profile</Link><button type="button" onClick={logout}>Log Out</button></div>}
    </div>
  )
}
