import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { QueryFilter } from 'mongoose';
import { LancamentosModel } from './lancamento.model';
import { toClient } from '../utils/toClient';
import { Lancamentos, LancamentosDocument } from './schemas/lancamentos.schema';
import { LancamentosValidator, LancamentosFilterValidator } from './validators/lancamentos.validators';

@Injectable()
export class LancamentoService {
  constructor(private readonly lancamentosModel: LancamentosModel) {}

  async getAll(): Promise<any[]> {
    const result = await this.lancamentosModel.getAll();
    return toClient(result);
  }

  async getById(lancamentoId: string): Promise<any | null> {
    if (!lancamentoId) {
      throw new BadRequestException('O ID do lançamento é obrigatório');
    }
    const item = await this.lancamentosModel.getById(lancamentoId);
    if (!item) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    return toClient(item);
  }

  async getByFilters(params: {
    ano?: number;
    mes?: number;
    produtoId?: string;
    categoria?: string;
    data_gte?: string;
    data_lte?: string;
    _sort?: string;
    _order?: 'asc' | 'desc';
  }): Promise<any[]> {
    LancamentosFilterValidator.validateAll(params);

    const filters: QueryFilter<LancamentosDocument> = {};
    if (params.ano) filters.ano = Number(params.ano);
    if (params.mes) filters.mes = Number(params.mes);
    if (params.produtoId) filters.produtoId = params.produtoId;
    if (params.categoria) filters.categoria = params.categoria;

    if (params.data_gte || params.data_lte) {
      filters.createdAt = {};
      if (params.data_gte) {
        const dataGte = new Date(params.data_gte);
        if (isNaN(dataGte.getTime())) {
          throw new BadRequestException('A data data_gte é inválida');
        }
        filters.createdAt.$gte = dataGte;
      }
      if (params.data_lte) {
        const dataLte = new Date(params.data_lte);
        if (isNaN(dataLte.getTime())) {
          throw new BadRequestException('A data data_lte é inválida');
        }
        filters.createdAt.$lte = dataLte;
      }
    }

    let sort: Record<string, 1 | -1> | undefined;
    if (params._sort) {
      sort = { [params._sort]: params._order === 'desc' ? -1 : 1 };
    }

    const result = await this.lancamentosModel.findByFilters(filters, sort);
    return toClient(result);
  }

  async create(dados: Partial<Lancamentos>): Promise<any> {
    dados.value = Number(dados.value);
    this.validarDadosLancamento(dados);
    const novo = await this.lancamentosModel.create(dados);
    return toClient(novo);
  }

  async update(lancamentoId: string, dados: Partial<Lancamentos>): Promise<any | null> {
    if (!lancamentoId) {
      throw new BadRequestException('O ID do lançamento é obrigatório');
    }
    const item = await this.lancamentosModel.getById(lancamentoId);
    if (!item) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    dados.value = Number(dados.value);
    this.validarDadosLancamento(dados, true);
    const updated = await this.lancamentosModel.update(lancamentoId, dados);
    return toClient(updated);
  }

  async delete(lancamentoId: string): Promise<any | null> {
    if (!lancamentoId) {
      throw new BadRequestException('O ID do lançamento é obrigatório');
    }
    const item = await this.lancamentosModel.delete(lancamentoId);
    if (!item) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    return toClient(item);
  }

  async getByAnoMes(ano: number, mes: number): Promise<any[]> {
    LancamentosValidator.validateAno(ano);
    LancamentosValidator.validateMes(mes);
    const result = await this.lancamentosModel.findByFilters({ ano: Number(ano), mes: Number(mes) });
    return toClient(result);
  }

  private validarDadosLancamento(dados: Partial<Lancamentos>, isUpdate = false): void {
    LancamentosValidator.validateAll(dados, isUpdate);
  }
}
