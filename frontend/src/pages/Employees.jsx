import { useEffect, useMemo, useState } from 'react'
import EmployeeCard from '../components/EmployeeCard'
import { getEmployees } from '../services/employeeService'

export default function Employees() {
  const [query, setQuery] = useState('')
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { getEmployees().then(setEmployees).catch((loadError) => setError(loadError.message)) }, [])
  const filteredEmployees = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return employees
    return employees.filter((employee) => [employee.name, employee.employeeId, employee.department, employee.title].some((value) => String(value || '').toLowerCase().includes(term)))
  }, [query, employees])

  return <main className="dashboard-content employee-list-page"><div className="page-heading"><div><p className="eyebrow">People directory</p><h1>Employees</h1><p className="welcome-copy">Browse your team and open a profile for more details.</p></div><span className="employee-count">{filteredEmployees.length} of {employees.length} people</span></div><div className="employee-toolbar"><label className="search-label" htmlFor="employee-search">Search employees</label><input id="employee-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, ID, department, or position" /></div>{error && <p className="form-message is-error">{error}</p>}<div className="employee-grid">{filteredEmployees.map((employee) => <EmployeeCard key={employee.id} employee={employee} />)}</div>{!error && filteredEmployees.length === 0 && <p className="empty-state">No employees found.</p>}</main>
}
