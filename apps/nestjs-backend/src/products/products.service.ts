import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../common/database.service'
import { ProductDto } from './product.dto'

@Injectable()
export class ProductsService {
  constructor(private db: DatabaseService) {}

  findAll(): ProductDto[] {
    return this.db.getDb().prepare(
      'SELECT * FROM products ORDER BY name ASC'
    ).all() as unknown as ProductDto[]
  }

  findOne(id: number): ProductDto | undefined {
    return this.db.getDb().prepare(
      'SELECT * FROM products WHERE id = ?'
    ).get(id) as unknown as ProductDto | undefined
  }
}
