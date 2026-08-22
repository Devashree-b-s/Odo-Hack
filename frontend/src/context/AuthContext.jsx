import { useState } from 'react'
import { mockLogin } from '../services/mockAuthService'
import { AuthContext } from './AuthContext'
const storageKey = 'dayflow.mockUser'

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  function login(identifier, password) {
    const result = mockLogin(identifier, password)
    if (result.success) {
      sessionStorage.setItem(storageKey, JSON.stringify(result.user))
      setUser(result.user)
    }
    return result
  }

  function logout() {
    sessionStorage.removeItem(storageKey)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        mustChangePassword: user?.mustChangePassword ?? false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
