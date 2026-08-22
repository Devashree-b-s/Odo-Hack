export default function AttendanceSummaryCard({ label, value, detail }) {
  return <article className="attendance-summary-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>
}
