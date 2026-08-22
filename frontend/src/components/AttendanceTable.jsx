import AttendanceStatusBadge from './AttendanceStatusBadge'

export default function AttendanceTable({ records, showEmployee = false }) {
  return <div className="table-scroll"><table className="attendance-table"><thead><tr>{showEmployee && <th>Employee</th>}<th>Date</th><th>Check In</th><th>Check Out</th><th>Work Hours</th><th>Extra Hours</th><th>Status</th></tr></thead><tbody>{records.map((record) => <tr key={record.id}>{showEmployee && <td><strong>{record.employeeName}</strong><small>{record.employeeId}</small></td>}<td>{record.date}</td><td>{record.checkIn}</td><td>{record.checkOut}</td><td>{record.workHours}</td><td>{record.extraHours}</td><td><AttendanceStatusBadge status={record.status} /></td></tr>)}</tbody></table></div>
}
