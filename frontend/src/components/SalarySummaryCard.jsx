export default function SalarySummaryCard({ label, value, detail }) {
  return <article className="salary-summary-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>
}
