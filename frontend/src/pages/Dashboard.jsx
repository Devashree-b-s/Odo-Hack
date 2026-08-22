import { Link } from 'react-router-dom'
import EmployeeCard from '../components/EmployeeCard'
import StatCard from '../components/StatCard'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getEmployees } from '../services/employeeService'
import { getAttendance } from '../services/attendanceService'

function DashboardHeading({ children, label }) {
  return <div className="dashboard-heading"><div><p className="eyebrow">{label}</p><h1>{children}</h1><p className="welcome-copy">Here is what is happening across your workspace today.</p></div><span className="today-label">Friday, 22 August 2026</span></div>
}

function AdminDashboard() {
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { Promise.all([getEmployees(), getAttendance()]).then(([loadedEmployees]) => setEmployees(loadedEmployees)).catch((loadError) => setError(loadError.message)) }, [])
  return <>
    <DashboardHeading label="HR administration">Good morning, Aarav</DashboardHeading>
    {error && <p className="form-message is-error">{error}</p>}<div className="dashboard-grid"><StatCard label="Total employees" value={employees.length || '—'} detail="From employee directory" /><StatCard label="Present today" value="—" detail="Attendance data" /><StatCard label="On leave today" value="—" detail="Leave data" /><StatCard label="Pending requests" value="—" detail="Leave data" /></div>
    <div className="dashboard-columns">
      <section className="dashboard-card"><div className="card-heading"><h2>Employee overview</h2><Link className="card-link" to="/employees">View all employees →</Link></div><div className="employee-list">{employees.map((employee) => <EmployeeCard key={employee.id} employee={employee} />)}</div></section>
      <section className="dashboard-card"><div className="card-heading"><h2>Attendance overview</h2><span className="card-link">Today</span></div><div className="attendance-bars"><div className="attendance-row"><span>Present</span><span className="bar-track"><span className="bar-fill" style={{ width: '81%' }} /></span><strong>81%</strong></div><div className="attendance-row"><span>On leave</span><span className="bar-track"><span className="bar-fill" style={{ width: '9%', background: '#d5a43b' }} /></span><strong>9%</strong></div><div className="attendance-row"><span>Absent</span><span className="bar-track"><span className="bar-fill" style={{ width: '10%', background: '#c87570' }} /></span><strong>10%</strong></div></div><Link className="action-button" to="/time-off">Review leave requests</Link></section>
    </div>
  </>
}

function EmployeeDashboard({ user }) {
  const initials = user.name.split(' ').map((part) => part[0]).join('')
  return <>
    <DashboardHeading label="Employee workspace">Good morning, {user.name.split(' ')[0]}</DashboardHeading>
    <div className="employee-dashboard-grid"><article className="dashboard-card quick-card"><span className="quick-icon">◷</span><h2>Today's attendance</h2><p>Not checked in yet</p><Link className="action-button" to="/attendance">Check in →</Link></article><article className="dashboard-card quick-card"><span className="quick-icon">◌</span><h2>Leave balance</h2><div className="balance-number">14 days</div><p>Available this year</p><Link className="card-link" to="/time-off">Request time off →</Link></article><article className="dashboard-card quick-card"><span className="quick-icon">▣</span><h2>Payroll & salary</h2><p>Latest payslip · July 2026</p><Link className="card-link" to="/profile">View details →</Link></article></div>
    <div className="dashboard-columns"><section className="dashboard-card"><div className="card-heading"><h2>Recent activity</h2><Link className="card-link" to="/time-off">View time off</Link></div><div className="leave-list"><div className="leave-row"><div><div className="leave-name">Annual leave</div><div className="leave-type">12 - 13 August 2026</div></div><span className="status-badge status-present">Approved</span></div><div className="leave-row"><div><div className="leave-name">Work anniversary</div><div className="leave-type">7 August 2026</div></div><span className="status-badge status-leave">Upcoming</span></div></div></section><section className="dashboard-card"><div className="card-heading"><h2>My profile</h2><Link className="card-link" to="/profile">Open →</Link></div><div className="employee-card"><span className="avatar">{initials}</span><div className="employee-info"><div className="employee-name">{user.name}</div><div className="employee-role">Employee workspace</div></div></div></section></div>
  </>
}

export default function Dashboard() {
  const { user } = useAuth()
  return user.role === 'HR_ADMIN' ? <AdminDashboard /> : <EmployeeDashboard user={user} />
}
