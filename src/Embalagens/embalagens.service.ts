import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EmbalagensModel } from './embalagens.model';
import { toClient } from '../utils/toClient';
import { Embalagem } from './schemas/embalagens.schema';

@Injectable()
export class EmbalagensService {
  constructor(private readonly embalagensModel: EmbalagensModel) {}
  
  async getAll(): Promise<any[]> {
    const result = await this.embalagensModel.getAll();
    return toClient(result);
  }

  async getByAtiva(ativa: boolean): Promise<any[]> {
    const result = await this.embalagensModel.getByAtiva(ativa);
    return toClient(result);
  }

  async getById(id: string): Promise<any> {
    const result = await this.embalagensModel.getById(id);
    if (!result) {
      throw new NotFoundException(`Embalagem com id ${id} não encontrada`);
    }
    return toClient(result);
  }

  async create(dados: Partial<Embalagem>): Promise<any> {
    if (!dados.quantidade) {
      throw new BadRequestException('O campo "quantidade" é obrigatório');
    }
    const result = await this.embalagensModel.create(dados);
    return toClient(result);
  }

  async update(id: string, dados: Partial<Embalagem>): Promise<any> {
    const existing = await this.embalagensModel.getById(id);
    if (!existing) {
      throw new NotFoundException(`Embalagem com id ${id} não encontrada`);
    }
    const result = await this.embalagensModel.update(id, dados);
    return toClient(result);
  }

  async delete(id: string): Promise<any> {
    const existing = await this.embalagensModel.getById(id);
    if (!existing) {
      throw new NotFoundException(`Embalagem com id ${id} não encontrada`);
    }
    const result = await this.embalagensModel.delete(id);
    return toClient(result);
  }
}
