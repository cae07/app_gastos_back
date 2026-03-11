import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Medida } from './schemas/medidas.schema';
import { MedidasModel } from './medidas.model';
import { toClient } from '../utils/toClient';

@Injectable()
export class MedidasService {
  constructor(
    private readonly medidasModel: MedidasModel,
  ) {}

  async getAll(): Promise<any[]> {
    const result = await this.medidasModel.getAll();
    return toClient(result);
  }

  async getByAtiva(ativa: boolean): Promise<any[]> {
    if (typeof ativa !== 'boolean') {
      throw new BadRequestException('O parâmetro ativa deve ser um booleano');
    }
    const result = await this.medidasModel.getByAtiva(ativa);
    return toClient(result);
  }

  async getById(medidaId: string): Promise<any | null> {
    if (!medidaId) {
      throw new BadRequestException('O ID da medida é obrigatório');
    }
    const medida = await this.medidasModel.getById(medidaId);
    if (!medida) {
      throw new NotFoundException('Medida não encontrada');
    }
    return toClient(medida);
  }

  async criarMedida(dados: Partial<Medida>): Promise<any> {
    this.validarDadosMedida(dados);
    const medidaExistente = await this.medidasModel.findOne({
      $or: [{ nome: dados.nome }, { sigla: dados.sigla }],
    });
    if (medidaExistente) {
      throw new BadRequestException(
        'Já existe uma medida com este nome ou sigla',
      );
    }
    const nova = await this.medidasModel.create(dados);
    return toClient(nova);
  }

  async update(medidaId: string, dados: Partial<Medida>): Promise<any | null> {
    if (!medidaId) {
      throw new BadRequestException('O ID da medida é obrigatório');
    }
    const medidaExistente = await this.medidasModel.getById(medidaId);
    if (!medidaExistente) {
      throw new NotFoundException('Medida não encontrada');
    }
    this.validarDadosMedida(dados, true);
    if (dados.nome || dados.sigla) {
      const duplicata = await this.medidasModel.findOne({
        $and: [
          { _id: { $ne: medidaId } },
          {
            $or: [
              { nome: dados.nome || medidaExistente.nome },
              { sigla: dados.sigla || medidaExistente.sigla },
            ],
          },
        ],
      });
      if (duplicata) {
        throw new BadRequestException(
          'Já existe outra medida com este nome ou sigla',
        );
      }
    }
    const updated = await this.medidasModel.update(medidaId, dados);
    return toClient(updated);
  }

  async deletarMedida(medidaId: string): Promise<Medida | null> {
    if (!medidaId) {
      throw new BadRequestException('O ID da medida é obrigatório');
    }

    const medida = await this.medidasModel.getById(medidaId);
    if (!medida) {
      throw new NotFoundException('Medida não encontrada');
    }

    return await this.medidasModel.delete(medidaId);
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

    if (dados.ativa !== undefined && typeof dados.ativa !== 'boolean') {
      throw new BadRequestException('O status ativa deve ser um booleano');
    }
  }
}
