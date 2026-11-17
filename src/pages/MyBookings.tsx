import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/auth-context'
import type { Booking } from '../types'
import { formatDate, getSavedBookingIds } from '../utils'

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const ids = getSavedBookingIds(user.email)

    // allSettled ignora las reservas que ya no existen
    Promise.allSettled(ids.map((id) => api.get<Booking>(`/flights/book/${id}`)))
      .then((results) => {
        const found: Booking[] = []
        for (const r of results) {
          if (r.status === 'fulfilled') found.push(r.value.data)
        }
        setBookings(found)
      })
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <p className="center">Cargando reservas...</p>

  return (
    <div>
      <h2>Mis reservas</h2>
      {bookings.length === 0 ? (
        <p className="empty">Aún no tienes reservas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vuelo</th>
              <th>Aerolínea</th>
              <th>Salida</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.flightNumber}</td>
                <td>{b.airlineName}</td>
                <td>{formatDate(b.estDepartureTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
