import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';

export interface ProductDto {
  id: number;
  name: string;
}

/**
 * HTTP клиент для обращения к провайдеру каталога товаров.
 * Базовый URL задаётся через переменную окружения PROVIDER_BASE_URL.
 */
@Injectable()
export class ProductClient {
  private readonly http: AxiosInstance;

  constructor(baseUrlOverride?: string) {
    const baseURL = baseUrlOverride || process.env.PROVIDER_BASE_URL || 'http://localhost:3002';
    this.http = axios.create({ baseURL });
  }

  /**
   * Получить товар по идентификатору у провайдера.
   */
  async getById(id: number): Promise<ProductDto> {
    const res = await this.http.get<ProductDto>(`/products/${id}`);
    return res.data;
  }
}


