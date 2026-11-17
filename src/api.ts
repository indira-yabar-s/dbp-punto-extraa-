import axios from 'axios'

// Cliente de Axios con la URL base del backend
const api = axios.create({ baseURL: 'http://localhost:8080' })

// Antes de cada request: si hay token, lo mandamos en el header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el backend responde 403 con un token guardado (token invalido),
// limpiamos el token y volvemos al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
