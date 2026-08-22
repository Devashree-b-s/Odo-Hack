import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoute, LoginRoute, ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext.jsx'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'
import EmployeeDetails from './pages/EmployeeDetails'
import Employees from './pages/Employees'
import Login from './pages/Login'
import ModulePlaceholder from './pages/ModulePlaceholder'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<LoginRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<AdminRoute />}>
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/:id" element={<EmployeeDetails />} />
            </Route>
            <Route path="/attendance" element={<ModulePlaceholder title="Attendance" description="Track working hours and attendance." />} />
            <Route path="/time-off" element={<ModulePlaceholder title="Time Off" description="Review leave balances and requests." />} />
            <Route path="/profile" element={<ModulePlaceholder title="My Profile" description="Keep your personal and work details up to date." />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
