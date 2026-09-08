import bcrypt from 'bcryptjs'
import db from './connection.js'
import { initializeSchema } from './schema.js'

async function seed() {
  console.log('🌱 Seeding database...')

  initializeSchema()

  db.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `)

  // =========================
  // USER
  // =========================

  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = db.prepare(`
    INSERT INTO users (username, password)
    VALUES (?, ?)
  `).run('admin', hashedPassword)

  const userId = user.lastInsertRowid

  console.log('✅ Usuario creado: admin / password123')

  // =========================
  // PRODUCTS
  // =========================

  const insertProduct = db.prepare(`
    INSERT INTO products (
      name,
      price,
      image,
      stock,
      description
    )
    VALUES (?, ?, ?, ?, ?)
  `)

  // ... products ...
    const products = [
    ['Camiseta Clásica Blanca', 19.99, 'https://placehold.co/400x500?text=Camiseta+Blanca', 50, 'Camiseta de algodón 100% de corte clásico'],
    ['Camiseta Oversize Negra', 24.99, 'https://placehold.co/400x500?text=Camiseta+Negra', 35, 'Camiseta oversize perfecta para looks casuales'],
    ['Jeans Slim Fit Azul', 49.99, 'https://placehold.co/400x500?text=Jeans+Azul', 30, 'Jeans de corte slim fit en denim azul clásico'],
    ['Jeans Mom Fit Gris', 54.99, 'https://placehold.co/400x500?text=Jeans+Gris', 25, 'Jeans de tiro alto estilo mom fit'],
    ['Vestido Floral Verde', 39.99, 'https://placehold.co/400x500?text=Vestido+Verde', 20, 'Vestido ligero con estampado floral'],
    ['Vestido Negro Elegante', 59.99, 'https://placehold.co/400x500?text=Vestido+Negro', 15, 'Vestido negro de corte elegante para ocasiones especiales'],
    ['Sudadera Verde Oliva', 34.99, 'https://placehold.co/400x500?text=Sudadera+Verde', 40, 'Sudadera cómoda con capucha en tono verde oliva'],
    ['Chaqueta Denim Azul', 79.99, 'https://placehold.co/400x500?text=Chaqueta+Denim', 18, 'Chaqueta clásica de denim con acabado desgastado'],
    ['Falda Plisada Beige', 29.99, 'https://placehold.co/400x500?text=Falda+Beige', 22, 'Falda plisada midi en tono beige neutro'],
    ['Pantalón Cargo Verde', 44.99, 'https://placehold.co/400x500?text=Cargo+Verde', 28, 'Pantalón cargo con múltiples bolsillos en verde militar'],
  ]

  for (const product of products) {
    insertProduct.run(...product)
  }

  console.log(`✅ ${products.length} productos creados`)

  // =========================
  // ORDERS
  // =========================

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      user_id,
      total,
      status,
      created_at,
      completed_at
    )
    VALUES (?, ?, ?, ?, ?)
  `)

  const insertItem = db.prepare(`
    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      unit_price
    )
    VALUES (?, ?, ?, ?)
  `)

  const o1 = insertOrder.run(
    userId,
    69.98,
    'COMPLETADO',
    '2026-09-07 08:00:00',
    '2026-09-07 08:05:00'
  )

  insertItem.run(o1.lastInsertRowid, 1, 2, 19.99)
  insertItem.run(o1.lastInsertRowid, 2, 1, 24.99)

    // Orden COMPLETADA sin fecha de cierre (defecto - patrón 4)
  const o2 = insertOrder.run(userId, 49.99, 'COMPLETADO', '2026-09-07 09:00:00', null)
  insertItem.run(o2.lastInsertRowid, 3, 1, 49.99)

  // Orden PENDIENTE (normal)
  const o3 = insertOrder.run(userId, 54.99, 'PENDIENTE', '2026-09-07 10:00:00', null)
  insertItem.run(o3.lastInsertRowid, 4, 1, 54.99)

  // Orden duplicada 1 (patrón 2)
  const o4 = insertOrder.run(userId, 39.99, 'COMPLETADO', '2026-09-07 11:00:00', '2026-09-07 11:05:00')
  insertItem.run(o4.lastInsertRowid, 5, 1, 39.99)

  // Orden duplicada 2 - mismo total, mismo usuario, mismo minuto (patrón 2)
  const o5 = insertOrder.run(userId, 39.99, 'COMPLETADO', '2026-09-07 11:00:00', '2026-09-07 11:05:00')
  insertItem.run(o5.lastInsertRowid, 5, 1, 39.99)

  // Orden RECHAZADA con items (defecto - patrón 4)
  const o6 = insertOrder.run(userId, 59.99, 'RECHAZADO', '2026-09-07 12:00:00', null)
  insertItem.run(o6.lastInsertRowid, 6, 1, 59.99)

  // ... o2, o3, o4, o5, o6 ...

  console.log('✅ Órdenes de prueba creadas')
  console.log('🎉 Seed completado')
}

seed().catch(console.error)