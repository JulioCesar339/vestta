export interface User {
  id: number
  username: string
}

export interface Product {
  id: number
  name: string
  price: number
  image: string
  stock: number
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface AuthResponse {
  token: string
  user: User
}
