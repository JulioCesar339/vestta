import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { productWithStockId, productNoStockId } from './setup.js'

let token: string

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password123' })
  token = res.body.token
})

describe('POST /api/cart/checkout', () => {
  it('debe retornar 200 y orderId con items válidos', async () => {
    const res = await request(app)
      .post('/api/cart/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: productWithStockId, quantity: 1 }] })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('orderId')
    expect(res.body).toHaveProperty('total')
    expect(res.body.message).toBe('Compra realizada con éxito')
  })

  it('debe retornar 400 con carrito vacío', async () => {
    const res = await request(app)
      .post('/api/cart/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [] })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('El carrito está vacío')
  })

  it('debe retornar 400 con quantity negativa', async () => {
    const res = await request(app)
      .post('/api/cart/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: productWithStockId, quantity: -1 }] })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('quantity debe ser un entero mayor a 0')
  })

  it('debe retornar 400 con quantity decimal', async () => {
    const res = await request(app)
      .post('/api/cart/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: productWithStockId, quantity: 1.5 }] })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('quantity debe ser un entero mayor a 0')
  })

  it('debe retornar 400 con quantity cero', async () => {
    const res = await request(app)
      .post('/api/cart/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: productWithStockId, quantity: 0 }] })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('quantity debe ser un entero mayor a 0')
  })

  it('debe retornar 404 con productId inexistente', async () => {
    const res = await request(app)
      .post('/api/cart/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: 9999, quantity: 1 }] })

    expect(res.status).toBe(404)
  })

  it('debe retornar 400 con stock insuficiente', async () => {
    const res = await request(app)
      .post('/api/cart/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: productNoStockId, quantity: 1 }] })

    expect(res.status).toBe(400)
    expect(res.body.message).toContain('Stock insuficiente')
  })

  it('debe retornar 401 sin token', async () => {
    const res = await request(app)
      .post('/api/cart/checkout')
      .send({ items: [{ productId: productWithStockId, quantity: 1 }] })

    expect(res.status).toBe(401)
  })

  it('debe calcular el total correctamente', async () => {
    const res = await request(app)
      .post('/api/cart/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: productWithStockId, quantity: 2 }] })

    expect(res.status).toBe(200)
    expect(res.body.total).toBeCloseTo(39.98, 2)
  })
})
