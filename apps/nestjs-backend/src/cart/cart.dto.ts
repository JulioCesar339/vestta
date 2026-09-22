import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator'

export class CartItemDto {
  @IsInt({ message: 'productId debe ser un entero' })
  @IsPositive({ message: 'productId debe ser un entero positivo' })
  productId!: number

  @IsInt({ message: 'quantity debe ser un entero' })
  @IsPositive({ message: 'quantity debe ser un entero mayor a 0' })
  quantity!: number
}

export class CheckoutDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'El carrito está vacío' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[]
}

export class CheckoutResponseDto {
  message!: string
  orderId!: number | bigint
  total!: number
}