import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import InfoRow from '../components/InfoRow'
import ProfileSection from '../components/ProfileSection'
import StatusBadge from '../components/StatusBadge'
import { getEmployee } from '../services/employeeService'

export default function EmployeeDetails() {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { getEmployee(id).then(setEmployee).catch((loadError) => setError(loadError.message)) }, [id])
  if (error) return <main className="dashboard-content"><p className="form-message is-error">{error}</p><Link className="back-link" to="/employees">Back to employees</Link></main>
  if (!employee) return <main className="dashboard-content"><p className="empty-state">Loading employee profile...</p></main>
  const initials = employee.name.split(' ').map((part) => part[0]).join('')

  return <main className="dashboard-content details-page"><Link className="back-link" to="/employees">← Back to employees</Link><div className="profile-hero"><span className="profile-avatar">{initials}</span><div><p className="eyebrow">Employee profile</p><h1>{employee.name}</h1><p>{employee.title} · {employee.department}</p></div><StatusBadge status={employee.status} /></div><ProfileSection title="Basic information"><InfoRow label="Full name" value={employee.name} /><InfoRow label="Employee ID" value={employee.employeeId} /><InfoRow label="Email" value={employee.email} /><InfoRow label="Mobile" value={employee.mobile} /><InfoRow label="Company" value={employee.company} /><InfoRow label="Department" value={employee.department} /><InfoRow label="Manager" value={employee.manager} /><InfoRow label="Job position" value={employee.title} /><InfoRow label="Joining date" value={employee.joiningDate} /><InfoRow label="Status" value={<StatusBadge status={employee.status} />} /></ProfileSection><ProfileSection title="Resume"><div className="document-placeholder">▣ <span>Resume document placeholder</span><small>Available when document storage is connected.</small></div></ProfileSection><ProfileSection title="Private info"><InfoRow label="Date of birth" value={employee.dateOfBirth} /><InfoRow label="Address" value={employee.address} /><InfoRow label="Nationality" value={employee.nationality} /><InfoRow label="Gender" value={employee.gender} /><InfoRow label="Personal email" value={employee.personalEmail} /><InfoRow label="Marital status" value={employee.maritalStatus} /></ProfileSection><div className="detail-columns"><ProfileSection title="Bank details"><InfoRow label="Account number" value={employee.accountNumber} /><InfoRow label="Bank name" value={employee.bankName} /><InfoRow label="IFSC" value={employee.ifsc} /></ProfileSection><ProfileSection title="Government details"><InfoRow label="UAN" value={employee.uan} /><InfoRow label="PAN" value={employee.pan} /></ProfileSection></div><ProfileSection title="Salary info"><div className="read-only-note">{employee.salary}<br /><small>Read-only mock summary. Payroll integration will be added later.</small></div></ProfileSection></main>
}
