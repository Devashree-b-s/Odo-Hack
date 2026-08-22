import { apiClient, unwrap } from './apiClient'
export function normalizeEmployee(employee) {
	return { ...employee, id: employee.id || employee._id || employee.employeeCode, name: employee.name || [employee.firstName, employee.lastName].filter(Boolean).join(' '), employeeId: employee.employeeId || employee.employeeCode, title: employee.title || employee.jobPosition, mobile: employee.mobile || employee.phone, status: employee.status === 'ACTIVE' ? 'Present' : employee.status === 'INACTIVE' ? 'Absent' : (employee.status || 'Present'), ...(employee.privateInfo || {}), ...(employee.bankDetails || {}), ...(employee.governmentDetails || {}) }
}
export async function getEmployees() { const data = unwrap(await apiClient.get('/api/employees')); return (Array.isArray(data) ? data : data?.employees || []).map(normalizeEmployee) }
export async function getEmployee(id) { const response = await apiClient.get(`/api/employees/${id}`); return normalizeEmployee(response.employee || response.data || response) }
export async function createEmployee(data) { return unwrap(await apiClient.post('/api/employees', data)) }
export async function updateEmployee(id, data) { return unwrap(await apiClient.put(`/api/employees/${id}`, data)) }
export async function updateEmployeeStatus(id, status) { return unwrap(await apiClient.patch(`/api/employees/${id}/status`, { status })) }
export async function getProfile() { const response = await apiClient.get('/api/profile/me'); return normalizeEmployee(response.profile || response.data || response) }
export async function updateProfile(data) { const response = await apiClient.patch('/api/profile/me', data); return normalizeEmployee(response.profile || response.data || response) }
