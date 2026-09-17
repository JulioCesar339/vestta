import { Response, Router } from 'express'
import { IRouter } from 'express'
import db from '../db/database.js'
import type { Product } from '../types/index.js'
import type { AuthRequest } from '../middleware/auth.js'

const router: IRouter = Router()

router.post('/checkout', (req: AuthRequest, res: Response): void => {
  const { items } = req.body as {
    items: { productId: number; quantity: number }[]
  }

  if (!items || items.length === 0) {
    res.status(400).json({ message: 'El carrito está vacío' })
    return
  }

  for (const item of items) {
    const product = db.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).get(item.productId) as unknown as Product | undefined

    if (!product) {
      res.status(404).json({ message: `Producto ${item.productId} no encontrado` })
      return
    }

    if (product.stock < item.quantity) {
      res.status(400).json({
        message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
      })
      return
    }
  }

  let total = 0
  for (const item of items) {
    const product = db.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).get(item.productId) as unknown as Product

    total += product.price * item.quantity
  }

  const userId = req.user!.userId
  const order = db.prepare(
    'INSERT INTO orders (user_id, total) VALUES (?, ?)'
  ).run(userId, total)

  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
  )
  const updateStock = db.prepare(
    'UPDATE products SET stock = stock - ? WHERE id = ?'
  )

  for (const item of items) {
    const product = db.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).get(item.productId) as unknown as Product

    insertItem.run(order.lastInsertRowid, item.productId, item.quantity, product.price)
    updateStock.run(item.quantity, item.productId)
  }

  res.json({
    message: 'Compra realizada con éxito',
    orderId: order.lastInsertRowid,
    total
  })
})

export default router
