import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { TiposDeProdutos } from './schemas/tiposDeProduto.schema';
import { TiposDeProdutosModel } from './tiposDeProduto.model';
import { toClient } from 'src/utils/toClient';

@Injectable()
export class TipoDeProdutoService {
  constructor(
    private readonly tipoDeProdutoModel: TiposDeProdutosModel,
  ) {}

  async getAll(): Promise<TiposDeProdutos[]> {
    const tiposDeProdutos = await this.tipoDeProdutoModel.getAll();
    return toClient(tiposDeProdutos);
  }

  async getAtivas(ativa: boolean): Promise<TiposDeProdutos[]> {
    const tiposDeProdutos = await this.tipoDeProdutoModel.getAtivas(ativa);
    return toClient(tiposDeProdutos);
  }

  async getById(tipoDeProdutoId: string): Promise<TiposDeProdutos | null> {
    if (!tipoDeProdutoId) {
      throw new BadRequestException('O ID do tipo de produto é obrigatório');
    }

    const tipoDeProduto = await this.tipoDeProdutoModel.getById(tipoDeProdutoId);
    if (!tipoDeProduto) {
      throw new NotFoundException('Tipo de produto não encontrado');
    }

    return toClient(tipoDeProduto);
  }

  async create(dados: Partial<TiposDeProdutos>): Promise<TiposDeProdutos> {
    this.validarDadosTipoDeProduto(dados);

    const tipoDeProdutoExistente = await this.tipoDeProdutoModel.findOne({
      nome: dados.nome,
    });

    if (tipoDeProdutoExistente) {
      throw new BadRequestException(
        'Já existe um tipo de produto com este nome',
      );
    }

    const tipoDeProduto = await this.tipoDeProdutoModel.create(dados);
    return toClient(tipoDeProduto);
  }

  async update(tipoDeProdutoId: string, dados: Partial<TiposDeProdutos>): Promise<TiposDeProdutos | null> {
    if (!tipoDeProdutoId) {
      throw new BadRequestException('O ID do tipo de produto é obrigatório');
    }

    const tipoDeProdutoExistente = await this.tipoDeProdutoModel.getById(tipoDeProdutoId);
    if (!tipoDeProdutoExistente) {
      throw new NotFoundException('Tipo de produto não encontrado');
    }

    this.validarDadosTipoDeProduto(dados, true);

    if (dados.nome) {
      const duplicata = await this.tipoDeProdutoModel.findOne({
        $and: [
          { _id: { $ne: tipoDeProdutoId } },
          { nome: dados.nome },
        ],
      })

      if (duplicata) {
        throw new BadRequestException(
          'Já existe outro tipo de produto com este nome',
        );
      }
    }

    const tipoDeProduto = await this.tipoDeProdutoModel
      .update(tipoDeProdutoId, dados);
    return toClient(tipoDeProduto);
  }

  async delete(tipoDeProdutoId: string): Promise<TiposDeProdutos | null> {
    if (!tipoDeProdutoId) {
      throw new BadRequestException('O ID do tipo de produto é obrigatório');
    }

    const tipoDeProduto = await this.tipoDeProdutoModel.getById(tipoDeProdutoId);
    if (!tipoDeProduto) {
      throw new NotFoundException('Tipo de produto não encontrado');
    }

    return await this.tipoDeProdutoModel.delete(tipoDeProdutoId);
  }

  private validarDadosTipoDeProduto(dados: Partial<TiposDeProdutos>, isUpdate = false): void {
    if (!isUpdate && !dados.nome) {
      throw new BadRequestException('O nome do tipo de produto é obrigatório');
    }

    if (!isUpdate && !dados.descricao) {
      throw new BadRequestException('A descrição do tipo de produto é obrigatória');
    }

    if (!isUpdate && dados.ativa === undefined) {
      throw new BadRequestException('O status ativa é obrigatório');
    }

    if (dados.nome !== undefined && typeof dados.nome !== 'string') {
      throw new BadRequestException('O nome deve ser uma string');
    }

    if (dados.nome !== undefined && dados.nome.trim().length === 0) {
      throw new BadRequestException('O nome não pode estar vazio');
    }

    if (dados.descricao !== undefined && typeof dados.descricao !== 'string') {
      throw new BadRequestException('A descrição deve ser uma string');
    }

    if (dados.descricao !== undefined && dados.descricao.trim().length === 0) {
      throw new BadRequestException('A descrição não pode estar vazia');
    }

    if (dados.ativa !== undefined && typeof dados.ativa !== 'boolean') {
      throw new BadRequestException('O status ativa deve ser um booleano');
    }
  }
}
