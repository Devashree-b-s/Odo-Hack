import PayrollStatusBadge from './PayrollStatusBadge'

export default function PayrollHistoryTable({ records }) {
  return <div className="table-scroll"><table className="payroll-table"><thead><tr><th>Month</th><th>Year</th><th>Gross salary</th><th>Deductions</th><th>Net salary</th><th>Status</th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td>{record.month}</td><td>{record.year}</td><td>{record.gross}</td><td>{record.deductions}</td><td><strong>{record.net}</strong></td><td><PayrollStatusBadge status={record.status} /></td></tr>)}</tbody></table></div>
}
