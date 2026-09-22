import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number
    username: string
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado')
    }

    const token = authHeader.split(' ')[1]
    const payload = await this.authService.validateToken(token)

    if (!payload) {
      throw new UnauthorizedException('Token inválido o expirado')
    }

    request.user = {
      userId: payload.userId,
      username: payload.username,
    }

    return true
  }
}
