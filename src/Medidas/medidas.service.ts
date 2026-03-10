import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medida } from './schemas/medidas.schema';

@Injectable()
export class MedidasService {
  constructor(
    @InjectModel(Medida.name) private medidaModel: Model<Medida>,
  ) {}

  async getAll(): Promise<Medida[]> {
    return await this.medidaModel.find().exec();
  }

  async getByAtiva(ativa: boolean): Promise<Medida[]> {
    if (typeof ativa !== 'boolean') {
      throw new BadRequestException('O parâmetro ativa deve ser um booleano');
    }
    return await this.medidaModel.find({ ativa }).exec();
  }

  async getById(medidaId: string): Promise<Medida | null> {
    if (!medidaId) {
      throw new BadRequestException('O ID da medida é obrigatório');
    }
    
    const medida = await this.medidaModel.findById(medidaId).exec();
    if (!medida) {
      throw new NotFoundException('Medida não encontrada');
    }
    
    return medida;
  }

  async criarMedida(dados: Partial<Medida>): Promise<Medida> {
    this.validarDadosMedida(dados);

    const medidaExistente = await this.medidaModel.findOne({
      $or: [{ nome: dados.nome }, { sigla: dados.sigla }],
    }).exec();

    if (medidaExistente) {
      throw new BadRequestException(
        'Já existe uma medida com este nome ou sigla',
      );
    }

    const novaMedida = new this.medidaModel(dados);
    return await novaMedida.save();
  }

  async update(medidaId: string, dados: Partial<Medida>): Promise<Medida | null> {
    if (!medidaId) {
      throw new BadRequestException('O ID da medida é obrigatório');
    }

    const medidaExistente = await this.medidaModel.findById(medidaId).exec();
    if (!medidaExistente) {
      throw new NotFoundException('Medida não encontrada');
    }

    this.validarDadosMedida(dados, true);

    if (dados.nome || dados.sigla) {
      const duplicata = await this.medidaModel.findOne({
        $and: [
          { _id: { $ne: medidaId } },
          {
            $or: [
              { nome: dados.nome || medidaExistente.nome },
              { sigla: dados.sigla || medidaExistente.sigla },
            ],
          },
        ],
      }).exec();

      if (duplicata) {
        throw new BadRequestException(
          'Já existe outra medida com este nome ou sigla',
        );
      }
    }

    return await this.medidaModel
      .findByIdAndUpdate(medidaId, dados, { new: true })
      .exec();
  }

  async deletarMedida(medidaId: string): Promise<Medida | null> {
    if (!medidaId) {
      throw new BadRequestException('O ID da medida é obrigatório');
    }

    const medida = await this.medidaModel.findById(medidaId).exec();
    if (!medida) {
      throw new NotFoundException('Medida não encontrada');
    }

    return await this.medidaModel.findByIdAndDelete(medidaId).exec();
  }

  private validarDadosMedida(dados: Partial<Medida>, isUpdate = false): void {
    if (!isUpdate && !dados.nome) {
      throw new BadRequestException('O nome da medida é obrigatório');
    }

    if (!isUpdate && !dados.sigla) {
      throw new BadRequestException('A sigla da medida é obrigatória');
    }

    if (!isUpdate && dados.ativa === undefined) {
      throw new BadRequestException('O status ativa é obrigatório');
    }

    if (dados.nome !== undefined && typeof dados.nome !== 'string') {
      throw new BadRequestException('O nome deve ser uma string');
    }

    if (dados.sigla !== undefined && typeof dados.sigla !== 'string') {
      throw new BadRequestException('A sigla deve ser uma string');
    }

    if (dados.nome !== undefined && dados.nome.trim().length === 0) {
      throw new BadRequestException('O nome não pode estar vazio');
    }

    if (dados.sigla !== undefined && dados.sigla.trim().length === 0) {
      throw new BadRequestException('A sigla não pode estar vazia');
    }

    if (dados.ativa !== undefined && typeof dados.ativa !== 'boolean') {
      throw new BadRequestException('O status ativa deve ser um booleano');
    }
  }
}
