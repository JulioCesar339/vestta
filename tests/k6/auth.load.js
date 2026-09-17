import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// Métricas personalizadas
const errorRate = new Rate('error_rate')
const loginDuration = new Trend('login_duration')

// Configuración del test
export const options = {
  stages: [
    { duration: '10s', target: 5 },  // Sube a 5 usuarios en 10s
    { duration: '20s', target: 5 },  // Mantiene 5 usuarios por 20s
    { duration: '10s', target: 0 },  // Baja a 0 usuarios en 10s
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% de requests bajo 2 segundos
    error_rate: ['rate<0.1'],          // Menos del 10% de errores
  },
}

const BASE_URL = 'http://localhost:3000/api'

export default function () {
  // Test de login exitoso
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ username: 'admin', password: 'password123' }),
    { headers: { 'Content-Type': 'application/json' } }
  )

  const loginOk = check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login tiene token': (r) => JSON.parse(r.body).token !== undefined,
    'login responde en menos de 2s': (r) => r.timings.duration < 2000,
  })

  loginDuration.add(loginRes.timings.duration)
  errorRate.add(!loginOk)

  sleep(1)

  // Test de login fallido
  const failedRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
    { headers: { 'Content-Type': 'application/json' } }
  )

  check(failedRes, {
    'login fallido status 401': (r) => r.status === 401,
  })

  sleep(1)
}
