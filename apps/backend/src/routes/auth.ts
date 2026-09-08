import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db from '../db/index.js'
import type { User } from '../types/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET ?? 'vestta_secret_dev'

// POST /api/auth/login
router.post('/login', (req: Request, res: Response): void => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({ message: 'Usuario y contraseña son requeridos' })
    return
  }

  const user = db.prepare(
    'SELECT * FROM users WHERE username = ?'
  ).get(username) as User | undefined

  if (!user) {
    res.status(401).json({ message: 'Credenciales incorrectas' })
    return
  }

  const passwordMatch = bcrypt.compareSync(password, user.password)

  if (!passwordMatch) {
    res.status(401).json({ message: 'Credenciales incorrectas' })
    return
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  )

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username
    }
  })
})

export default router
