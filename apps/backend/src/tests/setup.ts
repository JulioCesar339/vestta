import { beforeAll } from 'vitest'
import bcrypt from 'bcryptjs'
import db from '../db/database.js'

export let productWithStockId: number
export let productNoStockId: number

beforeAll(async () => {
  db.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM users;
  `)

  const hashedPassword = await bcrypt.hash('password123', 10)
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(
    'admin',
    hashedPassword
  )

  const p1 = db.prepare(`
    INSERT INTO products (name, price, image, stock, description)
    VALUES (?, ?, ?, ?, ?)
  `).run('Camiseta Test', 19.99, 'https://placehold.co/400x500', 50, 'Descripción test')

  const p2 = db.prepare(`
    INSERT INTO products (name, price, image, stock, description)
    VALUES (?, ?, ?, ?, ?)
  `).run('Jeans Test', 49.99, 'https://placehold.co/400x500', 0, 'Sin stock')

  productWithStockId = Number(p1.lastInsertRowid)
  productNoStockId = Number(p2.lastInsertRowid)
})
