import { apiClient, unwrap } from './apiClient'
export async function getLeaveBalance() { const data = unwrap(await apiClient.get('/api/leave/balance')); return { paid: { available: data.paidLeave, used: data.paidLeaveUsed, remaining: Number(data.paidLeave || 0) - Number(data.paidLeaveUsed || 0) }, sick: { available: data.sickLeave, used: data.sickLeaveUsed, remaining: Number(data.sickLeave || 0) - Number(data.sickLeaveUsed || 0) } } }
function normalizeRequest(request) { return { ...request, id: request.id || request._id, days: request.days ?? request.numberOfDays, comment: request.comment ?? request.reviewComment, startDate: request.startDate ? new Date(request.startDate).toLocaleDateString() : '-', endDate: request.endDate ? new Date(request.endDate).toLocaleDateString() : '-' } }
function requestList(data) { return (Array.isArray(data) ? data : data?.requests || []).map(normalizeRequest) }
export async function getMyLeaveRequests() { return requestList(unwrap(await apiClient.get('/api/leave/requests/me'))) }
export async function createLeaveRequest(data) { return normalizeRequest(unwrap(await apiClient.post('/api/leave/requests', data))) }
export async function getLeaveRequests() { return requestList(unwrap(await apiClient.get('/api/leave/requests'))) }
export async function getLeaveRequest(id) { return unwrap(await apiClient.get(`/api/leave/requests/${id}`)) }
export async function approveLeave(id) { return unwrap(await apiClient.patch(`/api/leave/requests/${id}/approve`, {})) }
export async function rejectLeave(id, comment) { return unwrap(await apiClient.patch(`/api/leave/requests/${id}/reject`, { comment })) }
