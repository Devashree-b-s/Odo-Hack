import { apiClient, setAccessToken, unwrap } from './apiClient'

export async function loginRequest(identifier, password) {
  const response = unwrap(await apiClient.post('/api/auth/login', { email: identifier, loginId: identifier, password }))
  const token = response?.token || response?.accessToken
  if (!token) throw new Error('Login response did not include an access token.')
  setAccessToken(token)
  return response.user || response
}
export async function currentUserRequest() { const response = unwrap(await apiClient.get('/api/auth/me')); return response.user || response }
export async function changePasswordRequest(currentPassword, newPassword) { return apiClient.post('/api/auth/change-password', { currentPassword, newPassword }) }
export async function logoutRequest() { try { await apiClient.post('/api/auth/logout') } finally { setAccessToken(null) } }
