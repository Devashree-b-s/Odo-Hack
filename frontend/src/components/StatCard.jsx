export default function StatCard({ label, value, detail }) {
  return <article className="stat-card"><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></article>
}
