import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PaymentModal from '../components/PaymentModal'
import { useCartStore } from '../store/index'
import { checkout } from '../services/cart'
import styles from './CartPage.module.css'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, removeItem, clearCart } = useCartStore()
  const [showModal, setShowModal] = useState(false)

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  async function handleConfirmPayment() {
    await checkout(
      items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      }))
    )
    clearCart()
    setTimeout(() => {
      setShowModal(false)
      navigate('/catalog')
    }, 2000)
  }

  return (
    <div>
      <Navbar />

      {showModal && (
        <PaymentModal
          total={total}
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div className={styles.container}>
        <h2 className={styles.title}>Carrito de compras</h2>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Tu carrito está vacío</p>
            <button
              className={styles.backBtn}
              onClick={() => navigate('/catalog')}
            >
              Volver al catálogo
            </button>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.list}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.item}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={styles.image}
                  />
                  <div className={styles.info}>
                    <h3 className={styles.name}>{item.product.name}</h3>
                    <p className={styles.units}>{item.quantity} unidades</p>
                    <p className={styles.price}>
                      ${item.product.price.toFixed(2)} c/u
                    </p>
                  </div>
                  <div className={styles.right}>
                    <p className={styles.subtotal}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Resumen</h3>
              <div className={styles.summaryRow}>
                <span>Total</span>
                <span className={styles.total}>${total.toFixed(2)}</span>
              </div>
              <button
                className={styles.checkoutBtn}
                onClick={() => setShowModal(true)}
              >
                Pagar
              </button>
              <button
                className={styles.continueBtn}
                onClick={() => navigate('/catalog')}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
