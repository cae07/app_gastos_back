import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/products.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(): Promise<Product[]> {
    return this.productService.getAll();
  }

  // @Post()
  // criarProduto(@Body() dados: Partial<Product>): Promise<Product> {
  //   return this.productService.criarProduto(dados);
  // }

  // @Delete()
  //   deletarProduto(@Body() dados: Partial<Product>): Promise<Product> {
  //     return this.productService.deletarProduto(dados);
  // }
}
