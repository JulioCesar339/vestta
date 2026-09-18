import { Response, Router, IRouter } from 'express'
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

  // Validación de estructura de cada item
  for (const item of items) {
    if (
      typeof item.productId !== 'number' ||
      !Number.isInteger(item.productId) ||
      item.productId <= 0
    ) {
      res.status(400).json({ message: 'productId debe ser un entero positivo' })
      return
    }

    if (
      typeof item.quantity !== 'number' ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      res.status(400).json({ message: 'quantity debe ser un entero mayor a 0' })
      return
    }
  }

  // Obtener todos los productos en una sola pasada
  const productMap = new Map<number, Product>()
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
        message: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
      })
      return
    }

    productMap.set(item.productId, product)
  }

  // Calcular total
  const total = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!
    return sum + product.price * item.quantity
  }, 0)

  // Operación atómica con transacción SQLite
  try {
    db.exec('BEGIN')

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
      const product = productMap.get(item.productId)!
      insertItem.run(order.lastInsertRowid, item.productId, item.quantity, product.price)
      updateStock.run(item.quantity, item.productId)
    }

    db.exec('COMMIT')

    res.json({
      message: 'Compra realizada con éxito',
      orderId: order.lastInsertRowid,
      total
    })
  } catch (error) {
    db.exec('ROLLBACK')
    console.error('Error en checkout:', error)
    res.status(500).json({ message: 'Error al procesar la compra' })
  }
})

export default router
