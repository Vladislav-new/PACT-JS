import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { IsInt, IsPositive, IsString } from 'class-validator';
import { ProductRepository, ProductDto } from './product.repository';

class CreateProductDto {
  @IsInt()
  @IsPositive()
  id!: number;

  @IsString()
  name!: string;
}

/**
 * Контроллер каталога товаров провайдера.
 */
@Controller('products')
export class ProductController {
  constructor(private readonly repo: ProductRepository) {}

  /**
   * Получить товар по id.
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): ProductDto {
    const found = this.repo.findById(id);
    if (!found) {
      throw new NotFoundException('Product not found');
    }
    return found;
  }

  /**
   * Создать товар.
   */
  @Post()
  create(@Body() dto: CreateProductDto): ProductDto {
    return this.repo.create(dto);
  }
}


