import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import productsRouter from './routes/products.js'
import cartRouter from './routes/cart.js'
import { authMiddleware } from './middleware/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

// Rutas públicas
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})
app.use('/api/auth', authRouter)

// Rutas protegidas
app.use('/api/products', authMiddleware, productsRouter)
app.use('/api/cart', authMiddleware, cartRouter)

app.listen(PORT, () => {
  console.log(`Vestta backend running on http://localhost:${PORT}`)
})

export default app
