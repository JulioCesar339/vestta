import { create } from 'zustand'
import type { User, CartItem, Product } from '../types/index'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  totalItems: () => number
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
}))

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, quantity) => {
    const items = get().items
    const existing = items.find((i) => i.product.id === product.id)

    if (existing) {
      set({
        items: items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      })
    } else {
      set({ items: [...items, { product, quantity }] })
    }
  },
  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.product.id !== productId) })
  },
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))
