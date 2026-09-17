import { Response, Router } from 'express'
import { IRouter } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db from '../db/database.js'
import type { User } from '../types/index.js'
import type { AuthRequest } from '../middleware/auth.js'

const router: IRouter = Router()
const JWT_SECRET = process.env.JWT_SECRET ?? 'vestta_secret_dev'

router.post('/login', (req: AuthRequest, res: Response): void => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({ message: 'Usuario y contraseña son requeridos' })
    return
  }

  const user = db.prepare(
    'SELECT * FROM users WHERE username = ?'
  ).get(username) as unknown as User | undefined

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
