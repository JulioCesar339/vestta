import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { AuthGuard } from '../auth/auth.guard'
import { ProductDto } from './product.dto'

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(): ProductDto[] {
    return this.productsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ProductDto {
    const product = this.productsService.findOne(id)
    if (!product) {
      throw new NotFoundException('Producto no encontrado')
    }
    return product
  }
}
