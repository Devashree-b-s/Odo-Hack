const mockUsers = [
  {
    id: 'hr-demo',
    email: 'hr@dayflow.demo',
    password: 'Dayflow123!',
    name: 'Aarav Mehta',
    role: 'HR_ADMIN',
    mustChangePassword: false,
  },
  {
    id: 'employee-demo',
    email: 'employee@dayflow.demo',
    password: 'Dayflow123!',
    name: 'Nisha Kapoor',
    role: 'EMPLOYEE',
    mustChangePassword: false,
  },
]

export function mockLogin(identifier, password) {
  const normalizedIdentifier = identifier.trim().toLowerCase()
  const user = mockUsers.find(
    (candidate) =>
      candidate.email === normalizedIdentifier || candidate.id === normalizedIdentifier,
  )

  if (!user || user.password !== password) {
    return { success: false, message: 'Invalid Login ID or password.' }
  }

  const { password: _password, ...safeUser } = user
  return { success: true, user: safeUser }
}
