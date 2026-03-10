import { Injectable, HttpStatus } from '@nestjs/common';
import { QueryFilter } from 'mongoose';
import { LancamentosModel } from './lancamento.model';
import { Lancamentos, LancamentosDocument } from './schemas/lancamentos.schema';
import { throwHttpError } from '../utils/error.handler';

@Injectable()
export class LancamentoService {
  constructor(private readonly lancamentosModel: LancamentosModel) {}

  async getAll(): Promise<Lancamentos[]> {
    return this.lancamentosModel.getAll();
  }

  async getById(lancamentoId: string): Promise<Lancamentos | null> {
    const item = await this.lancamentosModel.getById(lancamentoId);
    if (!item) {
      throwHttpError(HttpStatus.NOT_FOUND, 'Lançamento não encontrado');
    }
    return item;
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
  }): Promise<Lancamentos[]> {
    const filters: QueryFilter<LancamentosDocument> = {};

    if (params.ano) filters.ano = Number(params.ano);
    if (params.mes) filters.mes = Number(params.mes);
    if (params.produtoId) filters.produtoId = params.produtoId;
    if (params.categoria) filters.categoria = params.categoria;

    if (params.data_gte || params.data_lte) {
      filters.createdAt = {};
      if (params.data_gte) filters.createdAt.$gte = new Date(params.data_gte);
      if (params.data_lte) filters.createdAt.$lte = new Date(params.data_lte);
    }

    let sort: Record<string, 1 | -1> | undefined;
    if (params._sort) {
      sort = { [params._sort]: params._order === 'desc' ? -1 : 1 };
    }

    return this.lancamentosModel.findByFilters(filters, sort);
  }

  async create(dados: Partial<Lancamentos>): Promise<Lancamentos> {
    return this.lancamentosModel.create(dados);
  }

  async update(lancamentoId: string, dados: Partial<Lancamentos>): Promise<Lancamentos | null> {
    const item = await this.lancamentosModel.update(lancamentoId, dados);
    if (!item) {
      throwHttpError(HttpStatus.NOT_FOUND, 'Lançamento não encontrado');
    }
    return item;
  }

  async delete(lancamentoId: string): Promise<Lancamentos | null> {
    const item = await this.lancamentosModel.delete(lancamentoId);
    if (!item) {
      throwHttpError(HttpStatus.NOT_FOUND, 'Lançamento não encontrado');
    }
    return item;
  }

  async getByAnoMes(ano: number, mes: number): Promise<Lancamentos[]> {
    return this.lancamentosModel.findByFilters({ ano: Number(ano), mes: Number(mes) });
  }
}
