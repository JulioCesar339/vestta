import { Module } from '@nestjs/common'
import { ProductsModule } from './products/products.module'
import { CartModule } from './cart/cart.module'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './common/database.module'

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ProductsModule,
    CartModule,
  ],
})
export class AppModule {}
