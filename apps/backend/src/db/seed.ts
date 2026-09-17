import bcrypt from 'bcryptjs'
import db from './database.js'

async function seed() {
  console.log('🌱 Seeding database...')

  db.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM users;
  `)

  const hashedPassword = await bcrypt.hash('password123', 10)
  db.prepare(`
    INSERT INTO users (username, password) VALUES (?, ?)
  `).run('admin', hashedPassword)

  console.log('✅ Usuario creado: admin / password123')

  const insertProduct = db.prepare(`
    INSERT INTO products (name, price, image, stock, description)
    VALUES (?, ?, ?, ?, ?)
  `)

  const products: [string, number, string, number, string][] = [
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
    insertProduct.run(product[0], product[1], product[2], product[3], product[4])
  }

  console.log(`✅ ${products.length} productos creados`)
  console.log('🎉 Seed completado')
}

seed().catch(console.error)
