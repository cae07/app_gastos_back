import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { TiposDeGastos } from './schemas/tiposDeGastos.schema';
import { TiposDeGastosModel } from './tiposDeGastos.model';
import { toClient } from 'src/utils/toClient';

@Injectable()
export class TipoDeGastosService {
  constructor(
    private readonly tipoDeGastosModel: TiposDeGastosModel,
  ) {}

  async getAll(): Promise<TiposDeGastos[]> {
    const tiposDeGastos = await this.tipoDeGastosModel.getAll();
    return toClient(tiposDeGastos);
  }

  async getAtivas(ativa: boolean): Promise<TiposDeGastos[]> {
    const tiposDeGastos = await this.tipoDeGastosModel.getAtivas(ativa);
    return toClient(tiposDeGastos);
  }

  async getById(tipoDeGastosId: string): Promise<TiposDeGastos | null> {
    if (!tipoDeGastosId) {
      throw new BadRequestException('O ID do tipo de Gastos é obrigatório');
    }

    const tipoDeGastos = await this.tipoDeGastosModel.getById(tipoDeGastosId);
    if (!tipoDeGastos) {
      throw new NotFoundException('Tipo de Gastos não encontrado');
    }

    return toClient(tipoDeGastos);
  }

  async create(dados: Partial<TiposDeGastos>): Promise<TiposDeGastos> {
    this.validarDadosTipoDeGastos(dados);

    const tipoDeGastosExistente = await this.tipoDeGastosModel.findOne({
      nome: dados.nome,
    });

    if (tipoDeGastosExistente) {
      throw new BadRequestException(
        'Já existe um tipo de Gastos com este nome',
      );
    }

    const tipoDeGastos = await this.tipoDeGastosModel.create(dados);
    return toClient(tipoDeGastos);
  }

  async update(tipoDeGastosId: string, dados: Partial<TiposDeGastos>): Promise<TiposDeGastos | null> {
    if (!tipoDeGastosId) {
      throw new BadRequestException('O ID do tipo de Gastos é obrigatório');
    }

    const tipoDeGastosExistente = await this.tipoDeGastosModel.getById(tipoDeGastosId);
    if (!tipoDeGastosExistente) {
      throw new NotFoundException('Tipo de Gastos não encontrado');
    }

    this.validarDadosTipoDeGastos(dados, true);

    if (dados.nome) {
      const duplicata = await this.tipoDeGastosModel.findOne({
        $and: [
          { _id: { $ne: tipoDeGastosId } },
          { nome: dados.nome },
        ],
      })

      if (duplicata) {
        throw new BadRequestException(
          'Já existe outro tipo de Gastos com este nome',
        );
      }
    }

    const tipoDeGastos = await this.tipoDeGastosModel
      .update(tipoDeGastosId, dados);
    return toClient(tipoDeGastos);
  }

  async delete(tipoDeGastosId: string): Promise<TiposDeGastos | null> {
    if (!tipoDeGastosId) {
      throw new BadRequestException('O ID do tipo de Gastos é obrigatório');
    }

    const tipoDeGastos = await this.tipoDeGastosModel.getById(tipoDeGastosId);
    if (!tipoDeGastos) {
      throw new NotFoundException('Tipo de Gastos não encontrado');
    }

    return await this.tipoDeGastosModel.delete(tipoDeGastosId);
  }

  private validarDadosTipoDeGastos(dados: Partial<TiposDeGastos>, isUpdate = false): void {
    if (!isUpdate && !dados.nome) {
      throw new BadRequestException('O nome do tipo de Gastos é obrigatório');
    }

    if (!isUpdate && !dados.descricao) {
      throw new BadRequestException('A descrição do tipo de Gastos é obrigatória');
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
