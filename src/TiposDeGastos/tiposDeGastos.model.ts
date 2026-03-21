import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TiposDeGastos, TiposDeGastosDocument } from './schemas/tiposDeGastos.schema';

@Injectable()
export class TiposDeGastosModel {
  constructor(
    @InjectModel(TiposDeGastos.name) private readonly tiposDeGastosModel: Model<TiposDeGastosDocument>,
  ) {}

  async getAll(): Promise<TiposDeGastos[]> {
    return await this.tiposDeGastosModel.find().exec();
  }

  async getAtivas(ativa: boolean): Promise<TiposDeGastos[]> {
    return await this.tiposDeGastosModel.find({ ativa }).exec();
  }

  async getById(id: string): Promise<TiposDeGastos | null> {
    return await this.tiposDeGastosModel.findById(id).exec();
  }

  async create(dados: Partial<TiposDeGastos>): Promise<TiposDeGastos> {
    const novo = new this.tiposDeGastosModel(dados);
    return await novo.save();
  }

  async update(tipoDeGastosId: string, dados: Partial<TiposDeGastos>): Promise<TiposDeGastos | null> {
    return await this.tiposDeGastosModel
      .findByIdAndUpdate(tipoDeGastosId, dados, { returnDocument: 'after' })
      .exec();
  }

  async delete(tipoDeGastosId: string): Promise<TiposDeGastos | null> {
    return await this.tiposDeGastosModel.findByIdAndDelete(tipoDeGastosId).exec();
  }

  async findOne(filtro: Record<string, any>): Promise<TiposDeGastos | null> {
    return await this.tiposDeGastosModel.findOne(filtro).exec();
  }
}
