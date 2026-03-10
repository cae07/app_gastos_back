import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { QueryFilter } from 'mongoose';
import { LancamentosModel } from './lancamento.model';
import { Lancamentos, LancamentosDocument } from './schemas/lancamentos.schema';

@Injectable()
export class LancamentoService {
  private readonly MONTHS_VALID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(private readonly lancamentosModel: LancamentosModel) {}

  async getAll(): Promise<Lancamentos[]> {
    return this.lancamentosModel.getAll();
  }

  async getById(lancamentoId: string): Promise<Lancamentos | null> {
    if (!lancamentoId) {
      throw new BadRequestException('O ID do lançamento é obrigatório');
    }

    const item = await this.lancamentosModel.getById(lancamentoId);
    if (!item) {
      throw new NotFoundException('Lançamento não encontrado');
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
    this.validarFiltros(params);

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

    return this.lancamentosModel.findByFilters(filters, sort);
  }

  async create(dados: Partial<Lancamentos>): Promise<Lancamentos> {
    this.validarDadosLancamento(dados);
    return this.lancamentosModel.create(dados);
  }

  async update(lancamentoId: string, dados: Partial<Lancamentos>): Promise<Lancamentos | null> {
    if (!lancamentoId) {
      throw new BadRequestException('O ID do lançamento é obrigatório');
    }

    const item = await this.lancamentosModel.getById(lancamentoId);
    if (!item) {
      throw new NotFoundException('Lançamento não encontrado');
    }

    this.validarDadosLancamento(dados, true);
    return this.lancamentosModel.update(lancamentoId, dados);
  }

  async delete(lancamentoId: string): Promise<Lancamentos | null> {
    if (!lancamentoId) {
      throw new BadRequestException('O ID do lançamento é obrigatório');
    }

    const item = await this.lancamentosModel.delete(lancamentoId);
    if (!item) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    return item;
  }

  async getByAnoMes(ano: number, mes: number): Promise<Lancamentos[]> {
    if (!ano || typeof ano !== 'number') {
      throw new BadRequestException('O ano deve ser um número válido');
    }

    if (!mes || typeof mes !== 'number') {
      throw new BadRequestException('O mês deve ser um número válido');
    }

    if (!this.MONTHS_VALID.includes(mes)) {
      throw new BadRequestException('O mês deve estar entre 1 e 12');
    }

    return this.lancamentosModel.findByFilters({ 
      ano: Number(ano), 
      mes: Number(mes) 
    });
  }

  private validarDadosLancamento(dados: Partial<Lancamentos>, isUpdate = false): void {
    if (!isUpdate && !dados.produtoId) {
      throw new BadRequestException('O ID do produto é obrigatório');
    }

    if (!isUpdate && !dados.produtoName) {
      throw new BadRequestException('O nome do produto é obrigatório');
    }

    if (!isUpdate && dados.quantity === undefined) {
      throw new BadRequestException('A quantidade é obrigatória');
    }

    if (!isUpdate && dados.value === undefined) {
      throw new BadRequestException('O valor é obrigatório');
    }

    if (!isUpdate && !dados.ano) {
      throw new BadRequestException('O ano é obrigatório');
    }

    if (!isUpdate && !dados.mes) {
      throw new BadRequestException('O mês é obrigatório');
    }

    if (!isUpdate && !dados.embalagemId) {
      throw new BadRequestException('O ID da embalagem é obrigatório');
    }

    if (!isUpdate && !dados.categoria) {
      throw new BadRequestException('A categoria é obrigatória');
    }

    if (!isUpdate && !dados.mesNome) {
      throw new BadRequestException('O nome do mês é obrigatório');
    }

    if (dados.produtoId !== undefined && typeof dados.produtoId !== 'string') {
      throw new BadRequestException('O ID do produto deve ser uma string');
    }

    if (dados.produtoId !== undefined && dados.produtoId.trim().length === 0) {
      throw new BadRequestException('O ID do produto não pode estar vazio');
    }

    if (dados.produtoName !== undefined && typeof dados.produtoName !== 'string') {
      throw new BadRequestException('O nome do produto deve ser uma string');
    }

    if (dados.produtoName !== undefined && dados.produtoName.trim().length === 0) {
      throw new BadRequestException('O nome do produto não pode estar vazio');
    }

    if (dados.quantity !== undefined) {
      if (typeof dados.quantity !== 'number') {
        throw new BadRequestException('A quantidade deve ser um número');
      }
      if (dados.quantity <= 0) {
        throw new BadRequestException('A quantidade deve ser maior que zero');
      }
    }

    if (dados.value !== undefined) {
      if (typeof dados.value !== 'number') {
        throw new BadRequestException('O valor deve ser um número');
      }
      if (dados.value <= 0) {
        throw new BadRequestException('O valor deve ser maior que zero');
      }
    }

    if (dados.ano !== undefined) {
      if (typeof dados.ano !== 'number') {
        throw new BadRequestException('O ano deve ser um número');
      }
      if (dados.ano < 1900 || dados.ano > 2100) {
        throw new BadRequestException('O ano deve estar entre 1900 e 2100');
      }
    }

    if (dados.mes !== undefined) {
      if (typeof dados.mes !== 'number') {
        throw new BadRequestException('O mês deve ser um número');
      }
      if (!this.MONTHS_VALID.includes(dados.mes)) {
        throw new BadRequestException('O mês deve estar entre 1 e 12');
      }
    }

    if (dados.embalagemId !== undefined && typeof dados.embalagemId !== 'string') {
      throw new BadRequestException('O ID da embalagem deve ser uma string');
    }

    if (dados.embalagemId !== undefined && dados.embalagemId.trim().length === 0) {
      throw new BadRequestException('O ID da embalagem não pode estar vazio');
    }

    if (dados.categoria !== undefined && typeof dados.categoria !== 'string') {
      throw new BadRequestException('A categoria deve ser uma string');
    }

    if (dados.categoria !== undefined && dados.categoria.trim().length === 0) {
      throw new BadRequestException('A categoria não pode estar vazia');
    }

    if (dados.mesNome !== undefined && typeof dados.mesNome !== 'string') {
      throw new BadRequestException('O nome do mês deve ser uma string');
    }

    if (dados.mesNome !== undefined && dados.mesNome.trim().length === 0) {
      throw new BadRequestException('O nome do mês não pode estar vazio');
    }
  }

  private validarFiltros(params: {
    ano?: number;
    mes?: number;
    produtoId?: string;
    categoria?: string;
    data_gte?: string;
    data_lte?: string;
    _sort?: string;
    _order?: 'asc' | 'desc';
  }): void {
    if (params.ano && (typeof params.ano !== 'number' || params.ano < 1900 || params.ano > 2100)) {
      throw new BadRequestException('O ano deve ser um número entre 1900 e 2100');
    }

    if (params.mes && (typeof params.mes !== 'number' || !this.MONTHS_VALID.includes(params.mes))) {
      throw new BadRequestException('O mês deve ser um número entre 1 e 12');
    }

    if (params._order && !['asc', 'desc'].includes(params._order)) {
      throw new BadRequestException('A ordem deve ser asc ou desc');
    }
  }
}
