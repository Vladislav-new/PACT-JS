import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './modules/product/product.controller';
import { ProductRepository } from './modules/product/product.repository';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProductController],
  providers: [ProductRepository]
})
export class AppModule {}


