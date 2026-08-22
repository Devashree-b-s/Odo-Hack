import StatusBadge from './StatusBadge'
import { Link } from 'react-router-dom'

export default function EmployeeCard({ employee }) {
  const initials = employee.name.split(' ').map((part) => part[0]).join('').slice(0, 2)
  return <Link className="employee-card employee-card-link" to={`/employees/${employee.id}`}><span className="avatar">{initials}</span><div className="employee-info"><div className="employee-name">{employee.name}</div><div className="employee-role">{employee.employeeId} · {employee.department} · {employee.title}</div></div><StatusBadge status={employee.status} /></Link>
}
