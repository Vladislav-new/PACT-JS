import { Injectable } from '@nestjs/common';

export interface ProductDto {
  id: number;
  name: string;
}

/**
 * Простейшее in-memory хранилище товаров.
 */
@Injectable()
export class ProductRepository {
  private readonly items = new Map<number, ProductDto>([
    [42, { id: 42, name: 'Book' }]
  ]);

  findById(id: number): ProductDto | undefined {
    return this.items.get(id);
  }

  create(product: ProductDto): ProductDto {
    if (this.items.has(product.id)) {
      throw new Error('Product already exists');
    }
    this.items.set(product.id, product);
    return product;
  }
}


