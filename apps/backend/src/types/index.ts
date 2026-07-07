export interface User {
  id: number
  username: string
  password: string
  created_at: string
}

export interface Product {
  id: number
  name: string
  price: number
  image: string
  stock: number
  description: string
  created_at: string
}

export interface Order {
  id: number
  user_id: number
  total: number
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: number
}

export interface JwtPayload {
  userId: number
  username: string
}
