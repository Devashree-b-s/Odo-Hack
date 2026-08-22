import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import UserMenu from './UserMenu'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <header className="app-header"><UserMenu /></header>
        <Outlet />
      </div>
    </div>
  )
}
