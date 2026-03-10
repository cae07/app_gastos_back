import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

import { ProductsModel } from './product.model';
import { Product } from './schemas/products.schema';
import { throwHttpError } from 'src/utils/error.handler';

@Injectable()
export class ProductService {
  constructor(private readonly productModel: ProductsModel) {}

  async getAll(): Promise<Product[]> {
    return await this.productModel.getAll();
  }

  async getById(productId: string): Promise<Product | null> {
    const item = await this.productModel.getById(productId);
    if (!item) {
      throwHttpError(HttpStatus.NOT_FOUND, 'Produto não encontrado');
    }
    return item;
  }

  async criarProduto(dados: Partial<Product>): Promise<Product> {
    try {
      return await this.productModel.salvar(dados);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar produto';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  async update(productId: string, dados: Partial<Product>): Promise<Product | null> {
    try {
      const produtoExistente = await this.productModel.getById(productId);
      if (!produtoExistente) {
        throwHttpError(HttpStatus.NOT_FOUND, 'Produto não encontrado');
      }
      Object.assign(produtoExistente, dados);
      return this.productModel.update(productId, dados);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar produto';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  async deletarProduto(productId: string): Promise<Product | null> {
    try {
      const produtoExistente = await this.productModel.getById(productId);
      if (!produtoExistente) {
        throwHttpError(HttpStatus.NOT_FOUND, 'Produto não encontrado');
      }
      return this.productModel.delete(productId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao deletar produto';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  async getByType(productType: string): Promise<Product[]> {
    try {
      return this.productModel.getByType(productType);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar produtos por tipo';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }
}
