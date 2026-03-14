import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { QueryFilter } from 'mongoose';
import { LancamentosModel } from './lancamento.model';
import { toClient } from '../utils/toClient';
import { Lancamentos, LancamentosDocument } from './schemas/lancamentos.schema';

@Injectable()
export class LancamentoService {
  private readonly MONTHS_VALID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
    if (!ano || typeof ano !== 'number') {
      throw new BadRequestException('O ano deve ser um número válido');
    }
    if (!mes || typeof mes !== 'number') {
      throw new BadRequestException('O mês deve ser um número válido');
    }
    if (!this.MONTHS_VALID.includes(mes)) {
      throw new BadRequestException('O mês deve estar entre 1 e 12');
    }
    const result = await this.lancamentosModel.findByFilters({ ano: Number(ano), mes: Number(mes) });
    return toClient(result);
  }

  private validarDadosLancamento(dados: Partial<Lancamentos>, isUpdate = false): void {
    // Funções auxiliares
    const validateRequiredString = (value: any, fieldName: string, msg: string) => {
      if (value === undefined || value === null || value === '') {
        throw new BadRequestException(msg);
      }
      if (typeof value !== 'string') {
        throw new BadRequestException(`${fieldName} deve ser uma string`);
      }
      if (value.trim().length === 0) {
        throw new BadRequestException(`${fieldName} não pode estar vazio`);
      }
    };

    const validateRequiredNumber = (value: any, fieldName: string, msg: string) => {
      if (value === undefined || value === null) {
        throw new BadRequestException(msg);
      }
      if (typeof value !== 'number') {
        throw new BadRequestException(`${fieldName} deve ser um número`);
      }
    };

    const validatePositiveNumber = (value: any, fieldName: string, msg: string) => {
      validateRequiredNumber(value, fieldName, msg);
      if (value <= 0) {
        throw new BadRequestException(`${fieldName} deve ser maior que zero`);
      }
    };

    const validateNumberInRange = (value: any, fieldName: string, min: number, max: number, msg: string) => {
      validateRequiredNumber(value, fieldName, msg);
      if (value < min || value > max) {
        throw new BadRequestException(`${fieldName} deve estar entre ${min} e ${max}`);
      }
    };

    // Validações obrigatórias para criação
    if (!isUpdate) {
      validateRequiredString(dados.produtoName, 'O nome do produto', 'O nome do produto é obrigatório');
      validateRequiredNumber(dados.quantity, 'A quantidade', 'A quantidade é obrigatória');
      validateRequiredNumber(dados.value, 'O valor', 'O valor é obrigatório');
      validateRequiredNumber(dados.ano, 'O ano', 'O ano é obrigatório');
      validateRequiredNumber(dados.mes, 'O mês', 'O mês é obrigatório');
      validateRequiredString(dados.embalagemId, 'O ID da embalagem', 'O ID da embalagem é obrigatório');
      validateRequiredString(dados.categoria, 'A categoria', 'A categoria é obrigatória');
      validateRequiredString(dados.mesNome, 'O nome do mês', 'O nome do mês é obrigatório');
    }

    if (dados.produtoName !== undefined) {
      validateRequiredString(dados.produtoName, 'O nome do produto', 'O nome do produto é obrigatório');
    }
    if (dados.quantity !== undefined) {
      validatePositiveNumber(dados.quantity, 'A quantidade', 'A quantidade é obrigatória');
    }
    if (dados.value !== undefined) {
      validatePositiveNumber(dados.value, 'O valor', 'O valor é obrigatório');
    }
    if (dados.ano !== undefined) {
      validateNumberInRange(dados.ano, 'O ano', 1900, 2100, 'O ano é obrigatório');
    }
    if (dados.mes !== undefined) {
      validateRequiredNumber(dados.mes, 'O mês', 'O mês é obrigatório');
      if (!this.MONTHS_VALID.includes(dados.mes)) {
        throw new BadRequestException('O mês deve estar entre 1 e 12');
      }
    }
    if (dados.embalagemId !== undefined) {
      validateRequiredString(dados.embalagemId, 'O ID da embalagem', 'O ID da embalagem é obrigatório');
    }
    if (dados.categoria !== undefined) {
      validateRequiredString(dados.categoria, 'A categoria', 'A categoria é obrigatória');
    }
    if (dados.mesNome !== undefined) {
      validateRequiredString(dados.mesNome, 'O nome do mês', 'O nome do mês é obrigatório');
    }
    if (dados.medidaId !== undefined) {
      validateRequiredString(dados.medidaId, 'O ID da medida', 'O ID da medida é obrigatório');
    }
    if (dados.tipoProdutoId !== undefined) {
      validateRequiredString(dados.tipoProdutoId, 'O ID do tipo de produto', 'O ID do tipo de produto é obrigatório');
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
