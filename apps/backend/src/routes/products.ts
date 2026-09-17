import { Response, Router } from 'express'
import { IRouter } from 'express'
import db from '../db/database.js'
import type { Product } from '../types/index.js'
import type { AuthRequest } from '../middleware/auth.js'

const router: IRouter = Router()

router.get('/', (_req: AuthRequest, res: Response): void => {
  const products = db.prepare(
    'SELECT * FROM products ORDER BY name ASC'
  ).all() as unknown as Product[]

  res.json(products)
})

router.get('/:id', (req: AuthRequest, res: Response): void => {
  const id = String(req.params['id'])
  const product = db.prepare(
    'SELECT * FROM products WHERE id = ?'
  ).get(id) as unknown as Product | undefined

  if (!product) {
    res.status(404).json({ message: 'Producto no encontrado' })
    return
  }

  res.json(product)
})

export default router
