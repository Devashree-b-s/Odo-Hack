const statusLabels = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' }

export default function LeaveStatusBadge({ status }) {
  return <span className={`leave-status leave-${status.toLowerCase()}`}>{statusLabels[status] ?? status}</span>
}
