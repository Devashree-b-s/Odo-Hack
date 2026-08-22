import { useState } from 'react'
import PayrollHistoryTable from '../components/PayrollHistoryTable'
import SalaryComponentTable from '../components/SalaryComponentTable'
import SalarySummaryCard from '../components/SalarySummaryCard'
import { useAuth } from '../hooks/useAuth'
import { mockEmployees } from '../services/mockEmployeeData'
import { mockPayrollHistory, mockSalaryStructures } from '../services/mockPayrollData'

function Heading({ children, label, copy }) {
  return <div className="page-heading"><div><p className="eyebrow">{label}</p><h1>{children}</h1><p className="welcome-copy">{copy}</p></div><span className="employee-count">July 2026 payroll</span></div>
}

function SalaryView({ employee, admin = false }) {
  const structure = mockSalaryStructures[employee.employeeId]
  const history = mockPayrollHistory[employee.employeeId] ?? []
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState('')

  function handleGenerate() { setNotice(`Payroll generation queued for ${employee.name} (mock action).`) }
  function handleEdit() { setEditing((current) => !current); setNotice('') }

  return <><div className="payroll-employee-heading"><div className="payroll-person"><span className="profile-avatar payroll-avatar">{employee.name.split(' ').map((part) => part[0]).join('')}</span><div><h2>{employee.name}</h2><p>{employee.employeeId} · {employee.title} · {employee.department}</p></div></div>{admin && <div className="payroll-actions"><button className="secondary-button light-button" type="button" onClick={handleEdit}>{editing ? 'Close edit mode' : 'Edit salary structure'}</button><button className="action-button" type="button" onClick={handleGenerate}>Generate payroll</button></div>}</div>{notice && <div className="payroll-notice" role="status">{notice}</div>}<div className="salary-summary-grid"><SalarySummaryCard label="Monthly wage" value={structure.monthlyWage} detail="Gross monthly" /><SalarySummaryCard label="Yearly wage" value={structure.yearlyWage} detail="Annual gross" /><SalarySummaryCard label="Net salary" value={structure.netSalary} detail="After deductions" /></div>{editing && <div className="payroll-edit-panel"><strong>Mock salary management</strong><span>Editing controls are visual only. Values remain supplied by mock data.</span><button type="button" onClick={handleEdit}>Save mock structure</button></div>}<div className="salary-columns"><SalaryComponentTable title="Salary components" rows={structure.components} /><SalaryComponentTable title="Deductions" rows={structure.deductions} /></div><section className="dashboard-card payroll-history"><div className="card-heading"><h2>Payroll history</h2><span className="card-link">{history.length} records</span></div><PayrollHistoryTable records={history} /></section></>
}

export default function Payroll() {
  const { user } = useAuth()
  const isAdmin = user.role === 'HR_ADMIN'
  const currentEmployee = mockEmployees.find((employee) => employee.email === user.email) ?? mockEmployees[0]
  const [selectedId, setSelectedId] = useState(currentEmployee.employeeId)
  const selectedEmployee = mockEmployees.find((employee) => employee.employeeId === selectedId) ?? currentEmployee
  return <main className="dashboard-content payroll-page"><Heading label={isAdmin ? 'HR administration' : 'Employee workspace'} copy={isAdmin ? 'Review salary structures and payroll records across your team.' : 'Review your salary information and previous payroll records.'}>{isAdmin ? 'Payroll' : 'My Payroll'}</Heading>{isAdmin && <div className="payroll-selector"><label htmlFor="payroll-employee">Select employee<select id="payroll-employee" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{mockEmployees.map((employee) => <option key={employee.employeeId} value={employee.employeeId}>{employee.name} · {employee.employeeId}</option>)}</select></label></div>}<SalaryView employee={selectedEmployee} admin={isAdmin} /></main>
}
