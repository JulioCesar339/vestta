import api from './api'
import type { AuthResponse } from '../types/index'

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', { username, password })
  return response.data
}
