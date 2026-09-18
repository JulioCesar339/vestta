import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

describe('POST /api/auth/login', () => {
  it('debe retornar 200 y token con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('user')
    expect(res.body.user.username).toBe('admin')
  })

  it('debe retornar 401 con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Credenciales incorrectas')
  })

  it('debe retornar 401 con usuario inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'noexiste', password: 'password123' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Credenciales incorrectas')
  })

  it('debe retornar 400 con campos vacíos', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Usuario y contraseña son requeridos')
  })

  it('debe retornar 400 sin contraseña', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin' })

    expect(res.status).toBe(400)
  })

  it('el token JWT debe tener el formato correcto', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'password123' })

    const parts = res.body.token.split('.')
    expect(parts).toHaveLength(3)
  })
})
