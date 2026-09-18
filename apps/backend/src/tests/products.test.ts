import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { productWithStockId } from './setup.js'

let token: string

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password123' })
  token = res.body.token
})

describe('GET /api/products', () => {
  it('debe retornar 200 y lista de productos', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('debe retornar 401 sin token', async () => {
    const res = await request(app).get('/api/products')
    expect(res.status).toBe(401)
  })

  it('debe retornar 401 con token inválido', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', 'Bearer tokeninvalido')
    expect(res.status).toBe(401)
  })

  it('cada producto debe tener los campos requeridos', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)

    const product = res.body[0]
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('price')
    expect(product).toHaveProperty('stock')
    expect(product).toHaveProperty('image')
    expect(product).toHaveProperty('description')
  })
})

describe('GET /api/products/:id', () => {
  it('debe retornar 200 y el producto correcto', async () => {
    const res = await request(app)
      .get(`/api/products/${productWithStockId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('Camiseta Test')
  })

  it('debe retornar 404 con ID inexistente', async () => {
    const res = await request(app)
      .get('/api/products/9999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Producto no encontrado')
  })

  it('debe retornar 401 sin token', async () => {
    const res = await request(app).get('/api/products/1')
    expect(res.status).toBe(401)
  })
})
