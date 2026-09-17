import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// Interceptor: agrega el token JWT a cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: si el token expira redirige al login
// Solo redirige si había un token guardado (sesión expirada)
// No redirige en el login porque un 401 ahí es un error de credenciales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = !!localStorage.getItem('token')
    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
