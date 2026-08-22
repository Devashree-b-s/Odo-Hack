import { useEffect, useMemo, useState } from 'react'
import LeaveBalanceCard from '../components/LeaveBalanceCard'
import LeaveRequestForm from '../components/LeaveRequestForm'
import LeaveRequestTable from '../components/LeaveRequestTable'
import { useAuth } from '../hooks/useAuth'
import { getEmployees } from '../services/employeeService'
import { approveLeave, createLeaveRequest, getLeaveBalance, getLeaveRequests, getMyLeaveRequests, rejectLeave } from '../services/leaveService'

function Heading({ children, label, copy }) {
  return <div className="page-heading"><div><p className="eyebrow">{label}</p><h1>{children}</h1><p className="welcome-copy">{copy}</p></div><span className="employee-count">Friday, 22 August 2026</span></div>
}

function EmployeeTimeOff() {
  const [requests, setRequests] = useState([]); const [balance, setBalance] = useState(null); const [error, setError] = useState('')
  useEffect(() => { Promise.all([getLeaveBalance(), getMyLeaveRequests()]).then(([loadedBalance, loadedRequests]) => { setBalance(loadedBalance); setRequests(Array.isArray(loadedRequests) ? loadedRequests : loadedRequests?.requests || []) }).catch((loadError) => setError(loadError.message)) }, [])
  function addRequest(request) { createLeaveRequest(request).then((created) => setRequests((current) => [created, ...current])).catch((loadError) => setError(loadError.message)) }
  const balances = balance || { paid: { available: '—', used: '—', remaining: '—' }, sick: { available: '—', used: '—', remaining: '—' } }
  return <><Heading label="Employee workspace" copy="Plan time away, review your balance, and keep requests in one place.">Time Off</Heading>{error && <p className="form-message is-error">{error}</p>}<section><div className="card-heading section-heading"><h2>Leave balance</h2><span className="card-link">This year</span></div><div className="leave-balance-grid"><LeaveBalanceCard title="Paid Time Off" balance={balances.paid || balances.paidTimeOff || balances} /><LeaveBalanceCard title="Sick Time Off" balance={balances.sick || balances.sickTimeOff || balances} /></div></section><div className="time-off-columns"><section className="dashboard-card"><div className="card-heading"><h2>Request time off</h2><span className="card-link">New request</span></div><LeaveRequestForm onSubmit={addRequest} /></section><section className="dashboard-card"><div className="card-heading"><h2>Request history</h2><span className="card-link">{requests.length} requests</span></div><LeaveRequestTable requests={requests} /></section></div></>
}

function AdminTimeOff() {
  const [requests, setRequests] = useState([]); const [employees, setEmployees] = useState([]); const [error, setError] = useState('')
  const [status, setStatus] = useState('ALL')
  const [employee, setEmployee] = useState('ALL')
  const [type, setType] = useState('ALL')
  useEffect(() => { Promise.all([getLeaveRequests(), getEmployees()]).then(([loadedRequests, loadedEmployees]) => { setRequests(Array.isArray(loadedRequests) ? loadedRequests : loadedRequests?.requests || []); setEmployees(loadedEmployees) }).catch((loadError) => setError(loadError.message)) }, [])
  const filtered = useMemo(() => requests.filter((request) => (status === 'ALL' || request.status === status) && (employee === 'ALL' || request.employeeId === employee) && (type === 'ALL' || request.type === type)), [requests, status, employee, type])
  function review(id, nextStatus) { const action = nextStatus === 'APPROVED' ? approveLeave(id) : rejectLeave(id); action.then((updated) => setRequests((current) => current.map((request) => request.id === id ? { ...request, ...updated, status: nextStatus } : request))).catch((loadError) => setError(loadError.message)) }
  return <><Heading label="HR administration" copy="Review and action leave requests across the organization.">Time Off</Heading>{error && <p className="form-message is-error">{error}</p>}<div className="leave-filters"><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></label><label>Employee<select value={employee} onChange={(event) => setEmployee(event.target.value)}><option value="ALL">All employees</option>{employees.map((item) => <option key={item.employeeId} value={item.employeeId}>{item.name}</option>)}</select></label><label>Leave type<select value={type} onChange={(event) => setType(event.target.value)}><option value="ALL">All types</option><option value="PAID">Paid</option><option value="SICK">Sick</option><option value="UNPAID">Unpaid</option></select></label></div><section className="dashboard-card leave-history"><div className="card-heading"><h2>Leave requests</h2><span className="card-link">{filtered.length} requests</span></div><LeaveRequestTable requests={filtered} showEmployee onReview={review} /></section></>
}

export default function TimeOff() {
  const { user } = useAuth()
  return <main className="dashboard-content time-off-page">{user.role === 'HR_ADMIN' ? <AdminTimeOff /> : <EmployeeTimeOff />}</main>
}
