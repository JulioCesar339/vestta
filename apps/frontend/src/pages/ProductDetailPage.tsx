import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getProduct } from '../services/products'
import { useCartStore } from '../store/index'
import type { Product } from '../types/index'
import styles from './ProductDetailPage.module.css'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [notification, setNotification] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getProduct(Number(id))
        .then(setProduct)
        .catch(() => navigate('/catalog'))
        .finally(() => setLoading(false))
    }
  }, [id, navigate])

  function handleAddToCart() {
    if (!product) return
    addItem(product, quantity)
    setNotification(`"${product.name}" añadido al carrito`)
    setTimeout(() => setNotification(''), 3000)
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <p className={styles.loading}>Cargando producto...</p>
      </div>
    )
  }

  if (!product) return null

  return (
    <div>
      <Navbar />

      {notification && (
        <div className={styles.notification}>{notification}</div>
      )}

      <div className={styles.container}>
        <button className={styles.back} onClick={() => navigate('/catalog')}>
          ← Volver al catálogo
        </button>

        <div className={styles.detail}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
          />

          <div className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            <p className={styles.stock}>
              {product.stock > 0
                ? `${product.stock} unidades disponibles`
                : 'Sin stock'}
            </p>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.actions}>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={styles.qty}
              />
              <button
                className={styles.addBtn}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
