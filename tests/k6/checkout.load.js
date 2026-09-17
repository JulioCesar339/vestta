import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const errorRate = new Rate('error_rate')
const checkoutDuration = new Trend('checkout_duration')

export const options = {
  stages: [
    { duration: '10s', target: 3 }, // Checkout es pesado, menos usuarios
    { duration: '20s', target: 3 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // Checkout puede tardar hasta 3s
    error_rate: ['rate<0.1'],
  },
}

const BASE_URL = 'http://localhost:3000/api'

export function setup() {
  // Resetear el seed antes del test de carga
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

  // Obtener productos disponibles
  const productsRes = http.get(`${BASE_URL}/products`, { headers })
  const products = JSON.parse(productsRes.body)

  // Filtrar productos con stock disponible
  const available = products.filter((p) => p.stock > 0)

  if (available.length === 0) {
    console.log('Sin stock disponible para checkout')
    return
  }

  // Checkout con el primer producto disponible
  const product = available[0]
  const checkoutRes = http.post(
    `${BASE_URL}/cart/checkout`,
    JSON.stringify({
      items: [{ productId: product.id, quantity: 1 }],
    }),
    { headers }
  )

  const checkoutOk = check(checkoutRes, {
    'checkout status 200': (r) => r.status === 200,
    'checkout tiene orderId': (r) => JSON.parse(r.body).orderId !== undefined,
    'checkout responde en menos de 3s': (r) => r.timings.duration < 3000,
  })

  checkoutDuration.add(checkoutRes.timings.duration)
  errorRate.add(!checkoutOk)

  sleep(2)
}
