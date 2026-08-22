import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { currentUserRequest, loginRequest, logoutRequest } from '../services/authService'
import { getAccessToken, setAccessToken } from '../services/apiClient'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(() => !getAccessToken())

  useEffect(() => {
    if (!getAccessToken()) return undefined
    currentUserRequest().then(setUser).catch(() => setAccessToken(null)).finally(() => setReady(true))
  }, [])

  async function login(identifier, password) {
    const authenticatedUser = await loginRequest(identifier, password)
    setUser(authenticatedUser)
    return authenticatedUser
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
