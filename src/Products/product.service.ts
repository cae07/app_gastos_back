import { Injectable } from '@nestjs/common';
import { ProductsModel } from './product.model';
import { Product } from './schemas/products.schema';

@Injectable()
export class ProductService {
  constructor(private readonly productModel: ProductsModel) {}

  async getAll(): Promise<Product[]> {
    // Aqui você aplicaria regras de negócio
    // Ex: "Se o valor for negativo, lance um erro"
    return await this.productModel.getAll();
  }
}
