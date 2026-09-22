import { Injectable, Logger } from '@nestjs/common'

interface ValidateResponse {
  valid: boolean
  userId: number
  username: string
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly authServiceUrl = 
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:4000'

  async validateToken(token: string): Promise<ValidateResponse | null> {
    try {
      const response = await fetch(`${this.authServiceUrl}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return null
      }

      return response.json() as Promise<ValidateResponse>
    } catch (error) {
      this.logger.error('Error validando token con auth service:', error)
      return null
    }
  }
}
