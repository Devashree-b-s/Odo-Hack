export const mockLeaveBalances = {
  paid: { available: 18, used: 6, remaining: 12 },
  sick: { available: 10, used: 2, remaining: 8 },
}

export const mockLeaveRequests = [
  { id: 'leave-1', employeeId: 'DF-1024', employeeName: 'Nisha Kapoor', type: 'Paid', startDate: '12 Aug 2026', endDate: '13 Aug 2026', days: 2, reason: 'Family commitment', status: 'APPROVED', comment: 'Enjoy your time off.' },
  { id: 'leave-2', employeeId: 'DF-1117', employeeName: 'Priya Nair', type: 'Sick', startDate: '22 Aug 2026', endDate: '22 Aug 2026', days: 1, reason: 'Not feeling well', status: 'PENDING', comment: '' },
  { id: 'leave-3', employeeId: 'DF-1088', employeeName: 'Rahul Sharma', type: 'Paid', startDate: '28 Aug 2026', endDate: '29 Aug 2026', days: 2, reason: 'Personal travel', status: 'PENDING', comment: '' },
  { id: 'leave-4', employeeId: 'DF-1001', employeeName: 'Aarav Mehta', type: 'Unpaid', startDate: '04 Aug 2026', endDate: '04 Aug 2026', days: 1, reason: 'Personal appointment', status: 'REJECTED', comment: 'Please choose a working day.' },
]
