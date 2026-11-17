import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import api from '../api'
import { useAuth } from '../context/auth-context'
import type { Booking, Flight, SearchResponse } from '../types'
import { errorMessage, formatDate, saveBookingId } from '../utils'

export default function Search() {
  const { user } = useAuth()

  // filtros
  const [flightNumber, setFlightNumber] = useState('')
  const [airlineName, setAirlineName] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // resultados
  const [flights, setFlights] = useState<Flight[]>([])
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  // reserva
  const [bookMessage, setBookMessage] = useState('')
  const [bookError, setBookError] = useState('')
  const [booking, setBooking] = useState<Booking | null>(null)

  async function search() {
    setError('')
    try {
      const res = await api.get<SearchResponse>('/flights/search', {
        params: {
          flightNumber: flightNumber || undefined,
          airlineName: airlineName || undefined,
          estDepartureTimeFrom: from ? new Date(from).toISOString() : undefined,
          estDepartureTimeTo: to ? new Date(to).toISOString() : undefined,
        },
      })
      setFlights(res.data.items) // la lista viene dentro de "items"
      setSearched(true)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  // al entrar mostramos todos los vuelos
  useEffect(() => {
    search()
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    search()
  }

  async function handleBook(flight: Flight) {
    setBookMessage('')
    setBookError('')
    setBooking(null)
    try {
      const res = await api.post<{ id: number }>('/flights/book', { flightId: flight.id })
      if (user) saveBookingId(user.email, res.data.id)
      setBookMessage(`¡Reserva exitosa! ID de reserva: ${res.data.id}`)

      // detalle de la reserva
      const detail = await api.get<Booking>(`/flights/book/${res.data.id}`)
      setBooking(detail.data)

      search() // refresca los asientos disponibles
    } catch (err) {
      setBookError(errorMessage(err))
    }
  }

  return (
    <div>
      <h2>Búsqueda de vuelos</h2>

      <form className="filters" onSubmit={handleSubmit}>
        <div>
          <label>Número de vuelo</label>
          <input value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder="LA101" />
        </div>
        <div>
          <label>Aerolínea</label>
          <input value={airlineName} onChange={(e) => setAirlineName(e.target.value)} placeholder="LATAM" />
        </div>
        <div>
          <label>Salida desde</label>
          <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label>Salida hasta</label>
          <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <button type="submit">Buscar</button>
      </form>

      {error && <p className="error">{error}</p>}
      {bookMessage && <p className="success">{bookMessage}</p>}
      {bookError && <p className="error">{bookError}</p>}

      {booking && (
        <div className="detail">
          <h3>Detalle de la reserva #{booking.id}</h3>
          <p>Pasajero: {booking.customerFirstName} {booking.customerLastName}</p>
          <p>Vuelo: {booking.flightNumber} ({booking.airlineName})</p>
          <p>Salida: {formatDate(booking.estDepartureTime)}</p>
          <p>Llegada: {formatDate(booking.estArrivalTime)}</p>
          <p>Fecha de reserva: {formatDate(booking.bookingDate)}</p>
        </div>
      )}

      {searched && flights.length === 0 ? (
        <p className="empty">No se encontraron vuelos con esos filtros 😕</p>
      ) : (
        flights.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Aerolínea</th>
                <th>Salida</th>
                <th>Llegada</th>
                <th>Asientos</th>
                {user && <th></th>}
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f.id}>
                  <td>{f.flightNumber}</td>
                  <td>{f.airlineName}</td>
                  <td>{formatDate(f.estDepartureTime)}</td>
                  <td>{formatDate(f.estArrivalTime)}</td>
                  <td>{f.availableSeats}</td>
                  {user && (
                    <td>
                      <button onClick={() => handleBook(f)}>Reservar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {!user && <p className="hint">Inicia sesión para poder reservar un vuelo.</p>}
    </div>
  )
}
