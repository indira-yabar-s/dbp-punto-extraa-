import axios from 'axios'

// Saca el mensaje de error del backend (ProblemDetail -> detail)
export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 403) return 'Debes iniciar sesión para hacer esto'
    return err.response?.data?.detail ?? 'Error de conexión con el servidor'
  }
  return 'Error inesperado'
}

// Clave de localStorage donde guardamos los IDs de reservas de cada usuario
export function bookingsKey(email: string): string {
  return `bookings:${email}`
}

export function getSavedBookingIds(email: string): number[] {
  return JSON.parse(localStorage.getItem(bookingsKey(email)) ?? '[]')
}

export function saveBookingId(email: string, id: number) {
  const ids = getSavedBookingIds(email)
  localStorage.setItem(bookingsKey(email), JSON.stringify([...ids, id]))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleString()
}
