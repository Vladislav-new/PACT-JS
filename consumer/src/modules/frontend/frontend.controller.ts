import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductClient, ProductDto } from './product.client';

/**
 * Контроллер фронтенда: проксирует запросы к провайдеру.
 */
@Controller('frontend/products')
export class FrontendController {
  constructor(private readonly productClient: ProductClient) {}

  /**
   * Вернуть товар по id, получая его у сервиса-провайдера.
   */
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
    return this.productClient.getById(id);
  }
}


