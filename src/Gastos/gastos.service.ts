import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { GastosModel } from './gastos.model';
import { toClient } from '../utils/toClient';
import { Gastos } from './schemas/gastos.schema';
import { GastosValidator } from './validators/gastos.validators';

@Injectable()
export class GastosService {
  constructor(private readonly gastosModel: GastosModel) {}

  async getAll(): Promise<any[]> {
    const result = await this.gastosModel.getAll();
    return toClient(result);
  }

  async getById(gastoId: string): Promise<any | null> {
    if (!gastoId) {
      throw new BadRequestException('O ID do gasto é obrigatório');
    }
    const item = await this.gastosModel.getById(gastoId);
    if (!item) {
      throw new NotFoundException('Gasto não encontrado');
    }
    return toClient(item);
  }

  async create(dados: Partial<Gastos>): Promise<any> {
    GastosValidator.validateAll(dados, false);
    const result = await this.gastosModel.create(dados);
    return toClient(result);
  }

  async update(
    gastoId: string,
    dados: Partial<Gastos>,
  ): Promise<any | null> {
    if (!gastoId) {
      throw new BadRequestException('O ID do gasto é obrigatório');
    }
    GastosValidator.validateAll(dados, true);
    const result = await this.gastosModel.update(gastoId, dados);
    if (!result) {
      throw new NotFoundException('Gasto não encontrado para atualização');
    }
    return toClient(result);
  }

  async delete(gastoId: string): Promise<any | null> {
    if (!gastoId) {
      throw new BadRequestException('O ID do gasto é obrigatório');
    }
    const result = await this.gastosModel.delete(gastoId);
    if (!result) {
      throw new NotFoundException('Gasto não encontrado para exclusão');
    }
    return toClient(result);
  }

  async getByFilters(filtros: { ano?: number; mes?: number }): Promise<any[]> {
    const result = await this.gastosModel.getByFilters(filtros);
    return toClient(result);
  }
} 
