import { useMemo, useState } from 'react'
import EmployeeCard from '../components/EmployeeCard'
import { mockEmployees } from '../services/mockEmployeeData'

export default function Employees() {
  const [query, setQuery] = useState('')
  const filteredEmployees = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return mockEmployees
    return mockEmployees.filter((employee) => [employee.name, employee.employeeId, employee.department, employee.title].some((value) => value.toLowerCase().includes(term)))
  }, [query])

  return <main className="dashboard-content employee-list-page"><div className="page-heading"><div><p className="eyebrow">People directory</p><h1>Employees</h1><p className="welcome-copy">Browse your team and open a profile for more details.</p></div><span className="employee-count">{filteredEmployees.length} of {mockEmployees.length} people</span></div><div className="employee-toolbar"><label className="search-label" htmlFor="employee-search">Search employees</label><input id="employee-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, ID, department, or position" /></div><div className="employee-grid">{filteredEmployees.map((employee) => <EmployeeCard key={employee.id} employee={employee} />)}</div>{filteredEmployees.length === 0 && <p className="empty-state">No employees match your search.</p>}</main>
}
