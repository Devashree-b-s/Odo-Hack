export const mockAttendanceRecords = [
  { id: 'att-1', employeeId: 'DF-1024', employeeName: 'Nisha Kapoor', date: '22 Aug 2026', checkIn: '09:08 AM', checkOut: '-', workHours: '—', extraHours: '—', status: 'PRESENT' },
  { id: 'att-2', employeeId: 'DF-1024', employeeName: 'Nisha Kapoor', date: '21 Aug 2026', checkIn: '09:01 AM', checkOut: '06:12 PM', workHours: '9h 11m', extraHours: '1h 11m', status: 'PRESENT' },
  { id: 'att-3', employeeId: 'DF-1024', employeeName: 'Nisha Kapoor', date: '20 Aug 2026', checkIn: '-', checkOut: '-', workHours: '0h', extraHours: '0h', status: 'LEAVE' },
  { id: 'att-4', employeeId: 'DF-1088', employeeName: 'Rahul Sharma', date: '22 Aug 2026', checkIn: '-', checkOut: '-', workHours: '0h', extraHours: '0h', status: 'ABSENT' },
  { id: 'att-5', employeeId: 'DF-1117', employeeName: 'Priya Nair', date: '22 Aug 2026', checkIn: '-', checkOut: '-', workHours: '0h', extraHours: '0h', status: 'LEAVE' },
  { id: 'att-6', employeeId: 'DF-1001', employeeName: 'Aarav Mehta', date: '22 Aug 2026', checkIn: '08:42 AM', checkOut: '05:45 PM', workHours: '9h 03m', extraHours: '1h 03m', status: 'PRESENT' },
]

export const attendanceStatusLabels = { PRESENT: 'Present', ABSENT: 'Absent', HALF_DAY: 'Half day', LEAVE: 'Leave' }
