import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { currentUserRequest, loginRequest, logoutRequest } from '../services/authService'
import { getAccessToken, setAccessToken } from '../services/apiClient'

function normalizeUser(user) {
  const email = user?.email || ''
  const name = user?.name || user?.displayName || email.split('@')[0] || 'User'

  return { ...user, email, name }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(() => !getAccessToken())

  useEffect(() => {
    if (!getAccessToken()) return undefined
    currentUserRequest().then((currentUser) => setUser(normalizeUser(currentUser))).catch(() => setAccessToken(null)).finally(() => setReady(true))
  }, [])

  async function login(identifier, password) {
    const authenticatedUser = await loginRequest(identifier, password)
    const normalizedUser = normalizeUser(authenticatedUser)
    setUser(normalizedUser)
    return normalizedUser
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        mustChangePassword: user?.mustChangePassword ?? false,
        ready,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
