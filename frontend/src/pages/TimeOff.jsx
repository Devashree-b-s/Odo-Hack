import { useMemo, useState } from 'react'
import LeaveBalanceCard from '../components/LeaveBalanceCard'
import LeaveRequestForm from '../components/LeaveRequestForm'
import LeaveRequestTable from '../components/LeaveRequestTable'
import { useAuth } from '../hooks/useAuth'
import { mockEmployees } from '../services/mockEmployeeData'
import { mockLeaveBalances, mockLeaveRequests } from '../services/mockLeaveData'

function Heading({ children, label, copy }) {
  return <div className="page-heading"><div><p className="eyebrow">{label}</p><h1>{children}</h1><p className="welcome-copy">{copy}</p></div><span className="employee-count">Friday, 22 August 2026</span></div>
}

function EmployeeTimeOff({ user }) {
  const employee = mockEmployees.find((item) => item.email === user.email) ?? mockEmployees[0]
  const [requests, setRequests] = useState(() => mockLeaveRequests.filter((request) => request.employeeId === employee.employeeId))
  function addRequest(request) { setRequests((current) => [{ ...request, id: `leave-${Date.now()}`, employeeId: employee.employeeId, employeeName: employee.name, startDate: request.startDate || '-', endDate: request.endDate || '-', status: 'PENDING', comment: '' }, ...current]) }
  return <><Heading label="Employee workspace" copy="Plan time away, review your balance, and keep requests in one place.">Time Off</Heading><section><div className="card-heading section-heading"><h2>Leave balance</h2><span className="card-link">This year</span></div><div className="leave-balance-grid"><LeaveBalanceCard title="Paid Time Off" balance={mockLeaveBalances.paid} /><LeaveBalanceCard title="Sick Time Off" balance={mockLeaveBalances.sick} /></div></section><div className="time-off-columns"><section className="dashboard-card"><div className="card-heading"><h2>Request time off</h2><span className="card-link">New request</span></div><LeaveRequestForm onSubmit={addRequest} /></section><section className="dashboard-card"><div className="card-heading"><h2>Request history</h2><span className="card-link">{requests.length} requests</span></div><LeaveRequestTable requests={requests} /></section></div></>
}

function AdminTimeOff() {
  const [requests, setRequests] = useState(mockLeaveRequests)
  const [status, setStatus] = useState('ALL')
  const [employee, setEmployee] = useState('ALL')
  const [type, setType] = useState('ALL')
  const filtered = useMemo(() => requests.filter((request) => (status === 'ALL' || request.status === status) && (employee === 'ALL' || request.employeeId === employee) && (type === 'ALL' || request.type === type)), [requests, status, employee, type])
  function review(id, nextStatus) { setRequests((current) => current.map((request) => request.id === id ? { ...request, status: nextStatus, comment: nextStatus === 'APPROVED' ? 'Approved by HR.' : 'Please connect with HR for details.' } : request)) }
  return <><Heading label="HR administration" copy="Review and action leave requests across the organization.">Time Off</Heading><div className="leave-filters"><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></label><label>Employee<select value={employee} onChange={(event) => setEmployee(event.target.value)}><option value="ALL">All employees</option>{mockEmployees.map((item) => <option key={item.employeeId} value={item.employeeId}>{item.name}</option>)}</select></label><label>Leave type<select value={type} onChange={(event) => setType(event.target.value)}><option value="ALL">All types</option><option>Paid</option><option>Sick</option><option>Unpaid</option></select></label></div><section className="dashboard-card leave-history"><div className="card-heading"><h2>Leave requests</h2><span className="card-link">{filtered.length} requests</span></div><LeaveRequestTable requests={filtered} showEmployee onReview={review} /></section></>
}

export default function TimeOff() {
  const { user } = useAuth()
  return <main className="dashboard-content time-off-page">{user.role === 'HR_ADMIN' ? <AdminTimeOff /> : <EmployeeTimeOff user={user} />}</main>
}
