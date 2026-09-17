import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const errorRate = new Rate('error_rate')
const productsDuration = new Trend('products_duration')

export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Sube a 10 usuarios en 10s
    { duration: '30s', target: 10 }, // Mantiene 10 usuarios por 30s
    { duration: '10s', target: 0 },  // Baja a 0 usuarios en 10s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // Productos deben responder en menos de 500ms
    error_rate: ['rate<0.05'],        // Menos del 5% de errores
  },
}

const BASE_URL = 'http://localhost:3000/api'

// Función de setup: obtiene el token una sola vez
export function setup() {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ username: 'admin', password: 'password123' }),
    { headers: { 'Content-Type': 'application/json' } }
  )
  return { token: JSON.parse(res.body).token }
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`,
  }

  // Test de GET todos los productos
  const productsRes = http.get(`${BASE_URL}/products`, { headers })

  const productsOk = check(productsRes, {
    'products status 200': (r) => r.status === 200,
    'products retorna array': (r) => Array.isArray(JSON.parse(r.body)),
    'products tiene 10 items': (r) => JSON.parse(r.body).length === 10,
    'products responde en menos de 500ms': (r) => r.timings.duration < 500,
  })

  productsDuration.add(productsRes.timings.duration)
  errorRate.add(!productsOk)

  sleep(1)

  // Test de GET producto por ID
  const productRes = http.get(`${BASE_URL}/products/1`, { headers })

  check(productRes, {
    'product por ID status 200': (r) => r.status === 200,
    'product tiene nombre': (r) => JSON.parse(r.body).name !== undefined,
  })

  sleep(1)
}
