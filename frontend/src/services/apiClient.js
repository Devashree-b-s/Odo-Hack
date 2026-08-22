const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')
const tokenKey = 'dayflow.accessToken'

export function getAccessToken() { return sessionStorage.getItem(tokenKey) }
export function setAccessToken(token) { if (token) sessionStorage.setItem(tokenKey, token); else sessionStorage.removeItem(tokenKey) }

async function request(path, options = {}) {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : await response.text()
  if (!response.ok) throw new Error(body?.message || body?.error || `Request failed (${response.status})`)
  return body
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
}

export function unwrap(payload) { return payload?.data ?? payload }
