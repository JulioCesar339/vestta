import api from './api'

interface CheckoutItem {
  productId: number
  quantity: number
}

interface CheckoutResponse {
  message: string
  orderId: number
  total: number
}

export async function checkout(items: CheckoutItem[]): Promise<CheckoutResponse> {
  const response = await api.post<CheckoutResponse>('/cart/checkout', { items })
  return response.data
}
