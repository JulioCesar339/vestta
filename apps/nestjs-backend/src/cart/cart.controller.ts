import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'
import { CartService } from './cart.service'
import { CheckoutDto, CheckoutResponseDto } from './cart.dto'
import { AuthGuard, AuthenticatedRequest } from '../auth/auth.guard'

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('checkout')
  checkout(
    @Body() dto: CheckoutDto,
    @Req() req: AuthenticatedRequest,
  ): CheckoutResponseDto {
    return this.cartService.checkout(dto, req.user!.userId)
  }
}
