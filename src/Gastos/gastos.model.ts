import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gastos, GastosDocument } from './schemas/gastos.schema';

@Injectable()
export class GastosModel {
  constructor(
    @InjectModel(Gastos.name) private readonly gastosModel: Model<GastosDocument>,
  ) {}

  async getAll(): Promise<Gastos[]> {
    return await this.gastosModel.find().exec();
  }

  async getById(id: string): Promise<Gastos | null> {
    return await this.gastosModel.findById(id).exec();
  }

  async create(dados: Partial<Gastos>): Promise<Gastos> {
    const novo = new this.gastosModel(dados);
    return await novo.save();
  }

  async update(tipoDeGastosId: string, dados: Partial<Gastos>): Promise<Gastos | null> {
    return await this.gastosModel
      .findByIdAndUpdate(tipoDeGastosId, dados, { returnDocument: 'after' })
      .exec();
  }

  async delete(tipoDeGastosId: string): Promise<Gastos | null> {
    return await this.gastosModel.findByIdAndDelete(tipoDeGastosId).exec();
  }

  async findOne(filtro: Record<string, any>): Promise<Gastos | null> {
    return await this.gastosModel.findOne(filtro).exec();
  }

  async getByFilters(filtros: { ano?: number; mes?: number }): Promise<Gastos[]> {
    const query: Record<string, any> = {};
    if (filtros.ano !== undefined) {
      query.ano = filtros.ano;
    }
    if (filtros.mes !== undefined) {
      query.mes = filtros.mes;
    }
    return await this.gastosModel.find(query).exec();
  }
}
