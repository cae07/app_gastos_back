import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/products.schema';
import { throwHttpError } from '../utils/error.handler';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query('productType') productType?: string): Promise<Product[]> {
    try {
      if (productType) {
        return await this.productService.getByType(productType);
      }
      return await this.productService.getAll();
    } catch (error) {
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar produtos');
    }
  }

  @Get('/:productId')
  async getById(@Param('productId') productId: string): Promise<Product | null> {
    try {
      return await this.productService.getById(productId);
    } catch (error) {
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar produto');
    }
  }

  @Post()
  async criarProduto(@Body() dados: Partial<Product>): Promise<Product> {
    try {
      return await this.productService.criarProduto(dados);
    } catch (error) {
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao criar produto');
    }
  }

  @Patch('/:productId')
  async update(@Param('productId') productId: string, @Body() dados: Partial<Product>): Promise<Product | null> {
    try {
      return await this.productService.update(productId, dados);
    } catch (error) {
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao atualizar produto');
    }
  }

  @Delete('/:productId')
  async deletarProduto(@Param('productId') productId: string): Promise<Product | null> {
    try {
      return await this.productService.deletarProduto(productId);
    } catch (error) {
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao deletar produto');
    }
  }
}
