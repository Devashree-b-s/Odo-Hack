import { useMemo, useState } from 'react'
import AttendanceSummaryCard from '../components/AttendanceSummaryCard'
import AttendanceTable from '../components/AttendanceTable'
import { useAuth } from '../hooks/useAuth'
import { mockAttendanceRecords } from '../services/mockAttendanceData'
import { mockEmployees } from '../services/mockEmployeeData'

const today = '22 Aug 2026'

function PageHeading({ children, label, copy }) {
  return <div className="page-heading"><div><p className="eyebrow">{label}</p><h1>{children}</h1><p className="welcome-copy">{copy}</p></div><span className="employee-count">Friday, 22 August 2026</span></div>
}

function EmployeeAttendance({ employee }) {
  const [state, setState] = useState('NOT_CHECKED_IN')
  const [checkIn, setCheckIn] = useState('-')
  const [checkOut, setCheckOut] = useState('-')
  const records = useMemo(() => mockAttendanceRecords.filter((record) => record.employeeId === employee.employeeId && record.date !== today), [employee.employeeId])
  const status = state === 'NOT_CHECKED_IN' ? 'Not checked in' : state === 'WORKING' ? 'Working' : 'Completed'

  function handleCheckIn() { setCheckIn('09:15 AM'); setState('WORKING') }
  function handleCheckOut() { setCheckOut('06:10 PM'); setState('COMPLETED') }

  return <><PageHeading label="Employee workspace" copy="Keep your attendance up to date and review your recent workdays.">My Attendance</PageHeading><section className="attendance-today"><div><span className="section-kicker">Today · {today}</span><h2>{status}</h2><p>{state === 'NOT_CHECKED_IN' ? 'Start your workday when you are ready.' : state === 'WORKING' ? 'Your workday is currently in progress.' : 'Your workday has been recorded.'}</p></div><div className="today-actions"><div className="time-pair"><span>Check in</span><strong>{checkIn}</strong></div><div className="time-pair"><span>Check out</span><strong>{checkOut}</strong></div><button className="action-button" type="button" onClick={handleCheckIn} disabled={state !== 'NOT_CHECKED_IN'}>Check In</button><button className="secondary-button" type="button" onClick={handleCheckOut} disabled={state !== 'WORKING'}>Check Out</button></div></section><div className="attendance-summary-grid"><AttendanceSummaryCard label="Work hours" value={state === 'COMPLETED' ? '8h 55m' : '—'} detail="Today's total" /><AttendanceSummaryCard label="Extra hours" value={state === 'COMPLETED' ? '55m' : '—'} detail="Beyond daily hours" /><AttendanceSummaryCard label="Attendance" value="21 days" detail="Present this month" /></div><section className="dashboard-card attendance-history"><div className="card-heading"><h2>Attendance history</h2><span className="card-link">Recent records</span></div><AttendanceTable records={records} /></section></>
}

function AdminAttendance() {
  const [employeeFilter, setEmployeeFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('August 2026')
  const records = mockAttendanceRecords.filter((record) => employeeFilter === 'all' || record.employeeId === employeeFilter)
  return <><PageHeading label="HR administration" copy="Review attendance across the entire organization.">Attendance</PageHeading><div className="attendance-filters"><label>Month<select value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)}><option>August 2026</option><option>July 2026</option></select></label><label>Employee<select value={employeeFilter} onChange={(event) => setEmployeeFilter(event.target.value)}><option value="all">All employees</option>{mockEmployees.map((employee) => <option key={employee.employeeId} value={employee.employeeId}>{employee.name}</option>)}</select></label></div><section className="dashboard-card attendance-history"><div className="card-heading"><h2>Team attendance</h2><span className="card-link">{records.length} records</span></div><AttendanceTable records={records} showEmployee /></section></>
}

export default function Attendance() {
  const { user } = useAuth()
  const employee = mockEmployees.find((item) => item.email === user.email) ?? mockEmployees[0]
  return <main className="dashboard-content attendance-page">{user.role === 'HR_ADMIN' ? <AdminAttendance /> : <EmployeeAttendance employee={employee} />}</main>
}
