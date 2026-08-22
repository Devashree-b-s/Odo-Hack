const statusClasses = { Present: 'status-present', 'On Leave': 'status-leave', Absent: 'status-absent' }

export default function StatusBadge({ status }) {
  return <span className={`status-badge ${statusClasses[status] ?? ''}`}>{status}</span>
}
