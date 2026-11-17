import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/auth-context'

// Si no hay token -> al login
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading } = useAuth()

  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />
  if (loading) return <p className="center">Cargando...</p>

  return <>{children}</>
}
