import { apiClient, unwrap } from './apiClient'
export async function getSalary(id) { return unwrap(await apiClient.get(`/api/salary/${id}`)) }
export async function updateSalary(id, data) { return unwrap(await apiClient.put(`/api/salary/${id}`, data)) }
export async function generatePayroll(data) { return unwrap(await apiClient.post('/api/payroll/generate', data)) }
export async function getPayroll() { return unwrap(await apiClient.get('/api/payroll')) }
function normalizePayroll(record) { return { ...record, id: record.id || record._id, gross: record.gross ?? record.grossSalary, net: record.net ?? record.netSalary, deductions: typeof record.deductions === 'object' ? Object.values(record.deductions).reduce((total, value) => total + Number(value || 0), 0) : record.deductions } }
function payrollList(data) { const records = Array.isArray(data) ? data : data?.records || []; return records.map(normalizePayroll) }
export async function getEmployeePayroll(id) { return payrollList(unwrap(await apiClient.get(`/api/payroll/${id}`))) }
export async function getPayrollPeriod(id, year, month) { return unwrap(await apiClient.get(`/api/payroll/${id}/${year}/${month}`)) }
export async function getMyPayroll() { return payrollList(unwrap(await apiClient.get('/api/payroll/me'))) }
export async function getMyPayrollPeriod(year, month) { return unwrap(await apiClient.get(`/api/payroll/me/${year}/${month}`)) }
