import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';


import { ProductsModel } from './product.model';
import { Product } from './schemas/products.schema';
import { toClient } from '../utils/toClient';

@Injectable()
export class ProductService {
  constructor(private readonly productModel: ProductsModel) {}

  async getAll(): Promise<any[]> {
    const result = await this.productModel.getAll();
    return toClient(result);
  }

  async getById(productId: string): Promise<any | null> {
    if (!productId) {
      throw new BadRequestException('O ID do produto é obrigatório');
    }
    const item = await this.productModel.getById(productId);
    if (!item) {
      throw new NotFoundException('Produto não encontrado');
    }
    return toClient(item);
  }

  async criarProduto(dados: Partial<Product>): Promise<any> {
    this.validarDadosProduto(dados);
    const novo = await this.productModel.salvar(dados);
    return toClient(novo);
  }

  async update(productId: string, dados: Partial<Product>): Promise<any | null> {
    if (!productId) {
      throw new BadRequestException('O ID do produto é obrigatório');
    }
    const produtoExistente = await this.productModel.getById(productId);
    if (!produtoExistente) {
      throw new NotFoundException('Produto não encontrado');
    }
    this.validarDadosProduto(dados, true);
    const updated = await this.productModel.update(productId, dados);
    return toClient(updated);
  }

  async deletarProduto(productId: string): Promise<Product | null> {
    if (!productId) {
      throw new BadRequestException('O ID do produto é obrigatório');
    }

    const produtoExistente = await this.productModel.getById(productId);
    if (!produtoExistente) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.productModel.delete(productId);
  }

  async getByType(productType: string): Promise<any[]> {
    if (!productType) {
      throw new BadRequestException('O tipo de produto é obrigatório');
    }
    if (typeof productType !== 'string') {
      throw new BadRequestException('O tipo de produto deve ser uma string');
    }
    const result = await this.productModel.getByType(productType);
    return toClient(result);
  }

  private validarDadosProduto(dados: Partial<Product>, isUpdate = false): void {
    if (!isUpdate && !dados.name) {
      throw new BadRequestException('O nome do produto é obrigatório');
    }

    if (!isUpdate && !dados.measure) {
      throw new BadRequestException('A medida do produto é obrigatória');
    }

    if (!isUpdate && !dados.medidaId) {
      throw new BadRequestException('O ID da medida é obrigatório');
    }

    if (!isUpdate && !dados.productType) {
      throw new BadRequestException('O tipo de produto é obrigatório');
    }

    if (!isUpdate && !dados.tipoProdutoId) {
      throw new BadRequestException('O ID do tipo de produto é obrigatório');
    }

    if (!isUpdate && !dados.embalagemId) {
      throw new BadRequestException('O ID da embalagem é obrigatório');
    }

    if (dados.name !== undefined && typeof dados.name !== 'string') {
      throw new BadRequestException('O nome deve ser uma string');
    }

    if (dados.name !== undefined && dados.name.trim().length === 0) {
      throw new BadRequestException('O nome não pode estar vazio');
    }

    if (dados.measure !== undefined && typeof dados.measure !== 'string') {
      throw new BadRequestException('A medida deve ser uma string');
    }

    if (dados.measure !== undefined && dados.measure.trim().length === 0) {
      throw new BadRequestException('A medida não pode estar vazia');
    }

    if (dados.medidaId !== undefined && typeof dados.medidaId !== 'string') {
      throw new BadRequestException('O ID da medida deve ser uma string');
    }

    if (dados.medidaId !== undefined && dados.medidaId.trim().length === 0) {
      throw new BadRequestException('O ID da medida não pode estar vazio');
    }

    if (dados.productType !== undefined && typeof dados.productType !== 'string') {
      throw new BadRequestException('O tipo de produto deve ser uma string');
    }

    if (dados.productType !== undefined && dados.productType.trim().length === 0) {
      throw new BadRequestException('O tipo de produto não pode estar vazio');
    }

    if (dados.tipoProdutoId !== undefined && typeof dados.tipoProdutoId !== 'string') {
      throw new BadRequestException('O ID do tipo de produto deve ser uma string');
    }

    if (dados.tipoProdutoId !== undefined && dados.tipoProdutoId.trim().length === 0) {
      throw new BadRequestException('O ID do tipo de produto não pode estar vazio');
    }

    if (dados.embalagemId !== undefined && typeof dados.embalagemId !== 'string') {
      throw new BadRequestException('O ID da embalagem deve ser uma string');
    }

    if (dados.embalagemId !== undefined && dados.embalagemId.trim().length === 0) {
      throw new BadRequestException('O ID da embalagem não pode estar vazio');
    }
  }
}
