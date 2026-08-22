import { apiClient, unwrap } from './apiClient'
export async function checkIn() { return unwrap(await apiClient.post('/api/attendance/check-in', {})) }
export async function checkOut() { return unwrap(await apiClient.post('/api/attendance/check-out', {})) }
export async function getMyAttendance() { return unwrap(await apiClient.get('/api/attendance/me')) }
export async function getAttendance() { return unwrap(await apiClient.get('/api/attendance')) }
export async function getEmployeeAttendance(id) { return unwrap(await apiClient.get(`/api/attendance/${id}`)) }
