import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FrontendController } from './modules/frontend/frontend.controller';
import { ProductClient } from './modules/frontend/product.client';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [FrontendController],
  providers: [ProductClient]
})
export class AppModule {}


