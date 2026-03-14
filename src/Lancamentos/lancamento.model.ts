import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { Lancamentos, LancamentosDocument } from './schemas/lancamentos.schema';

@Injectable()
export class LancamentosModel {
  constructor(
    @InjectModel(Lancamentos.name) private readonly model: Model<LancamentosDocument>,
  ) {}

  async getAll(): Promise<Lancamentos[]> {
    return this.model.find().exec();
  }

  async getById(id: string): Promise<Lancamentos | null> {
    return this.model.findById(id).exec();
  }

  async create(dados: Partial<Lancamentos>): Promise<Lancamentos> {
    const novo = new this.model(dados);
    return novo.save();
  }

  async update(id: string, dados: Partial<Lancamentos>): Promise<Lancamentos | null> {
    return this.model.findByIdAndUpdate(id, dados, { returnDocument: 'after' }).exec();
  }

  async delete(id: string): Promise<Lancamentos | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async findByFilters(
    filters: QueryFilter<LancamentosDocument>,
    sort?: Record<string, 1 | -1>,
  ): Promise<Lancamentos[]> {
    const query = this.model.find(filters);
    if (sort) {
      query.sort(sort);
    }
    return query.exec();
  }
}
