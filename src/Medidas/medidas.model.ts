import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medida, MedidaDocument } from './schemas/medidas.schema';

@Injectable()
export class MedidasModel {
  constructor(
    @InjectModel(Medida.name) private readonly medidaModel: Model<MedidaDocument>,
  ) {}

  async getAll(): Promise<Medida[]> {
    return await this.medidaModel.find().exec();
  }

  async getByAtiva(ativa: boolean): Promise<Medida[]> {
    return await this.medidaModel.find({ ativa }).exec();
  }

  async getById(id: string): Promise<Medida | null> {
    return await this.medidaModel.findById(id).exec();
  }

  async create(dados: Partial<Medida>): Promise<Medida> {
    const novaMedida = new this.medidaModel(dados);
    return await novaMedida.save();
  }

  async update(medidaId: string, dados: Partial<Medida>): Promise<Medida | null> {
    return await this.medidaModel
      .findByIdAndUpdate(medidaId, dados, { new: true })
      .exec();
  }

  async delete(medidaId: string): Promise<Medida | null> {
    return await this.medidaModel.findByIdAndDelete(medidaId).exec();
  }

  async findOne(filtro: Record<string, any>): Promise<Medida | null> {
    return await this.medidaModel.findOne(filtro).exec();
  }
}
