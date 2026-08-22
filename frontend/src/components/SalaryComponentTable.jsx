export default function SalaryComponentTable({ title, rows }) {
  return <section className="dashboard-card salary-table-card"><div className="card-heading"><h2>{title}</h2><span className="card-link">Read only</span></div><div className="salary-rows">{rows.map(([label, value]) => <div className="salary-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
}
