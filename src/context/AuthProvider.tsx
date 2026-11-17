import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import api from '../api'
import type { User } from '../types'
import { AuthContext } from './auth-context'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // si hay token al abrir la app, esperamos a cargar el usuario
  const [loading, setLoading] = useState(!!localStorage.getItem('token'))

  // Al abrir la app: si hay token, pedimos el usuario actual
  useEffect(() => {
    if (!localStorage.getItem('token')) return
    api
      .get<User>('/users/current')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    localStorage.removeItem('token') // por si quedo un token viejo
    const res = await api.post<{ token: string }>('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    const me = await api.get<User>('/users/current')
    setUser(me.data)
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
