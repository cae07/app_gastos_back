import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { Embalagem, EmbalagemDocument } from './schemas/embalagens.schema';

@Injectable()
export class EmbalagensModel {
    constructor(
        @InjectModel(Embalagem.name) private readonly model: Model<EmbalagemDocument>,
    ) {}

    async getAll(): Promise<Embalagem[]> {
        return this.model.find().exec();
    }

    async getById(id: string): Promise<Embalagem | null> {
        return this.model.findById(id).exec();
    }

    async create(dados: Partial<Embalagem>): Promise<Embalagem> {
        const novo = new this.model(dados);
        return novo.save();
    }

    async update(id: string, dados: Partial<Embalagem>): Promise<Embalagem | null> {
        return this.model.findByIdAndUpdate(id, dados, { new: true }).exec();
    }

    async delete(id: string): Promise<Embalagem | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    async getByAtiva(ativa: boolean): Promise<Embalagem[]> {
        const filter: QueryFilter<EmbalagemDocument> = { ativa };
        return this.model.find(filter).exec();
    }
}
