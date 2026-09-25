import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

interface LoginDto {
  username: string
  password: string
}

@Controller('auth')
export class AuthController {
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:4000'

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const response = await fetch(`${this.authServiceUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new HttpException(data, response.status as HttpStatus)
    }

    return data
  }
}
