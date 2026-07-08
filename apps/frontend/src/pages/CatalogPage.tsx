import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getProducts } from '../services/products'
import { useCartStore } from '../store/index'
import type { Product } from '../types/index'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const addItem = useCartStore((s) => s.addItem)

  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [notification, setNotification] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [location.key])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleQuantityChange(productId: number, value: string) {
    const qty = parseInt(value)
    if (!isNaN(qty) && qty > 0) {
      setQuantities((prev) => ({ ...prev, [productId]: qty }))
    }
  }

  function handleAddToCart(product: Product) {
    const qty = quantities[product.id] ?? 1
    addItem(product, qty)
    setNotification(`"${product.name}" añadido al carrito`)
    setTimeout(() => setNotification(''), 3000)
  }

  return (
    <div>
      <Navbar />

      {notification && (
        <div className={styles.notification}>{notification}</div>
      )}

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Catálogo</h2>
          <input
            className={styles.search}
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className={styles.empty}>Cargando productos...</p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No se encontraron productos</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((product) => (
              <div key={product.id} className={styles.card}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.image}
                />
                <div className={styles.info}>
                  <h3 className={styles.name}>{product.name}</h3>
                  <p className={styles.price}>${product.price.toFixed(2)}</p>
                  <p className={styles.stock}>
                    {product.stock > 0
                      ? `${product.stock} disponibles`
                      : 'Sin stock'}
                  </p>

                  <div className={styles.actions}>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantities[product.id] ?? 1}
                      onChange={(e) =>
                        handleQuantityChange(product.id, e.target.value)
                      }
                      className={styles.qty}
                    />
                    <button
                      className={styles.addBtn}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      Añadir
                    </button>
                  </div>

                  <button
                    className={styles.detailBtn}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
