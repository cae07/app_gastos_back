import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TiposDeProdutos, TiposDeProdutosDocument } from './schemas/tiposDeProduto.schema';

@Injectable()
export class TiposDeProdutosModel {
  constructor(
    @InjectModel(TiposDeProdutos.name) private readonly tiposDeProdutosModel: Model<TiposDeProdutosDocument>,
  ) {}

  async getAll(): Promise<TiposDeProdutos[]> {
    return await this.tiposDeProdutosModel.find().exec();
  }

  async getAtivas(ativa: boolean): Promise<TiposDeProdutos[]> {
    return await this.tiposDeProdutosModel.find({ ativa }).exec();
  }

  async getById(id: string): Promise<TiposDeProdutos | null> {
    return await this.tiposDeProdutosModel.findById(id).exec();
  }

  async create(dados: Partial<TiposDeProdutos>): Promise<TiposDeProdutos> {
    const novo = new this.tiposDeProdutosModel(dados);
    return await novo.save();
  }

  async update(tipoDeProdutoId: string, dados: Partial<TiposDeProdutos>): Promise<TiposDeProdutos | null> {
    return await this.tiposDeProdutosModel
      .findByIdAndUpdate(tipoDeProdutoId, dados, { returnDocument: 'after' })
      .exec();
  }

  async delete(tipoDeProdutoId: string): Promise<TiposDeProdutos | null> {
    return await this.tiposDeProdutosModel.findByIdAndDelete(tipoDeProdutoId).exec();
  }

  async findOne(filtro: Record<string, any>): Promise<TiposDeProdutos | null> {
    return await this.tiposDeProdutosModel.findOne(filtro).exec();
  }
}
