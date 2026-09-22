import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { DatabaseService } from '../common/database.service'
import { CheckoutDto, CheckoutResponseDto } from './cart.dto'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

@Injectable()
export class CartService {
  constructor(private db: DatabaseService) {}

  checkout(dto: CheckoutDto, userId: number): CheckoutResponseDto {
    const db = this.db.getDb()

    // Obtener todos los productos en una sola pasada
    const productMap = new Map<number, Product>()
    for (const item of dto.items) {
      const product = db.prepare(
        'SELECT * FROM products WHERE id = ?'
      ).get(item.productId) as unknown as Product | undefined

      if (!product) {
        throw new NotFoundException(`Producto ${item.productId} no encontrado`)
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
        )
      }

      productMap.set(item.productId, product)
    }

    // Calcular total
    const total = dto.items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!
      return sum + product.price * item.quantity
    }, 0)

    // Transacción atómica
    let orderId: number | bigint = 0

    try {
      db.exec('BEGIN')

      const order = db.prepare(
        'INSERT INTO orders (user_id, total) VALUES (?, ?)'
      ).run(userId, total)

      const insertItem = db.prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
      )
      const updateStock = db.prepare(
        'UPDATE products SET stock = stock - ? WHERE id = ?'
      )

      for (const item of dto.items) {
        const product = productMap.get(item.productId)!
        insertItem.run(order.lastInsertRowid, item.productId, item.quantity, product.price)
        updateStock.run(item.quantity, item.productId)
      }

      db.exec('COMMIT')
      orderId = order.lastInsertRowid
    } catch (error) {
      db.exec('ROLLBACK')
      throw error
    }

    return {
      message: 'Compra realizada con éxito',
      orderId,
      total,
    }
  }
}
