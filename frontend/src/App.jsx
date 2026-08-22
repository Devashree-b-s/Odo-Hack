import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoute, LoginRoute, ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext.jsx'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import ChangePassword from './pages/ChangePassword'
import EmployeeDetails from './pages/EmployeeDetails'
import Employees from './pages/Employees'
import Login from './pages/Login'
import Payroll from './pages/Payroll'
import Profile from './pages/Profile'
import TimeOff from './pages/TimeOff'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<LoginRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePassword />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<AdminRoute />}>
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/:id" element={<EmployeeDetails />} />
            </Route>
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/time-off" element={<TimeOff />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
