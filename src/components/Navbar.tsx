import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">✈ Fly Away</Link>
      <div className="links">
        <Link to="/">Buscar vuelos</Link>
        {user ? (
          <>
            <Link to="/my-bookings">Mis reservas</Link>
            <span className="user">Hola, {user.firstName} {user.lastName}</span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  )
}
