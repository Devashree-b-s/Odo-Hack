import { attendanceStatusLabels } from '../services/mockAttendanceData'

export default function AttendanceStatusBadge({ status }) {
  return <span className={`attendance-status status-${status.toLowerCase()}`}>{attendanceStatusLabels[status] ?? status}</span>
}
