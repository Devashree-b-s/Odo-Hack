const labels = { DRAFT: 'Draft', FINALIZED: 'Finalized', PAID: 'Paid' }

export default function PayrollStatusBadge({ status }) {
  return <span className={`payroll-status payroll-${status.toLowerCase()}`}>{labels[status] ?? status}</span>
}
