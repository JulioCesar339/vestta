import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, useCartStore } from '../store/index'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((s) => s.logout)
  const totalItems = useCartStore((s) => s.totalItems)

  function handleLogout() {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className={styles.nav}>
      <span className={styles.brand} onClick={() => navigate('/catalog')}>
        VESTTA
      </span>

      <div className={styles.links}>
        <button
          className={`${styles.link} ${isActive('/catalog') ? styles.linkActive : ''}`}
          onClick={() => navigate('/catalog')}
        >
          Catálogo
        </button>

        <button
          className={`${styles.link} ${isActive('/cart') ? styles.linkActive : ''}`}
          onClick={() => navigate('/cart')}
        >
          Carrito
          {totalItems() > 0 && (
            <span className={styles.badge}>{totalItems()}</span>
          )}
        </button>

        <button className={styles.logout} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
