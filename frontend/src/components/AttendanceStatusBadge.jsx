const attendanceStatusLabels = { PRESENT: 'Present', ABSENT: 'Absent', HALF_DAY: 'Half day', LEAVE: 'Leave' }

export default function AttendanceStatusBadge({ status }) {
  return <span className={`attendance-status status-${status.toLowerCase()}`}>{attendanceStatusLabels[status] ?? status}</span>
}
