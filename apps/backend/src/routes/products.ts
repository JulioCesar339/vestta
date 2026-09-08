import { Router, Request, Response } from 'express'
import db from '../db/index.js'
import type { Product } from '../types/index.js'

const router = Router()

// GET /api/products
router.get('/', (_req: Request, res: Response): void => {
  const products = db.prepare(
    'SELECT * FROM products ORDER BY name ASC'
  ).all() as Product[]

  res.json(products)
})

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response): void => {
  const product = db.prepare(
    'SELECT * FROM products WHERE id = ?'
  ).get(req.params.id) as Product | undefined

  if (!product) {
    res.status(404).json({ message: 'Producto no encontrado' })
    return
  }

  res.json(product)
})

export default router
