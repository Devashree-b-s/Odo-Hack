import StatusBadge from './StatusBadge'

export default function EmployeeCard({ employee }) {
  const initials = employee.name.split(' ').map((part) => part[0]).join('').slice(0, 2)
  return <article className="employee-card"><span className="avatar">{initials}</span><div className="employee-info"><div className="employee-name">{employee.name}</div><div className="employee-role">{employee.title} · {employee.department}</div></div><StatusBadge status={employee.status} /></article>
}
