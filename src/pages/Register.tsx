import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { errorMessage } from '../utils'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    // validar campos vacios antes de enviar
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      await api.post('/users/register', { email, firstName, lastName, password })
      setSuccess('Registro exitoso. Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="card">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Nombre</label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />

        <label>Apellido</label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  )
}
