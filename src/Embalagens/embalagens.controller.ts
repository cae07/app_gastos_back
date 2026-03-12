import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { EmbalagensService } from './embalagens.service';
import { Embalagem } from './schemas/embalagens.schema';
import { throwHttpError } from '../utils/error.handler';

@Controller('embalagens')
export class EmbalagensController {
  constructor(private readonly embalagensService: EmbalagensService) {}

  @Get()
  async getAll(@Query('ativa') ativa?: boolean): Promise<Embalagem[]> {
    try {
      if (ativa !== undefined) {
        return await this.embalagensService.getByAtiva(ativa);
      }
      return await this.embalagensService.getAll();
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erro ao buscar embalagens';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  async getById(@Param('id') id: string): Promise<Embalagem> {
    try {
      return await this.embalagensService.getById(id);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      const message = error instanceof Error ? error.message : `Erro ao buscar embalagem com id ${id}`;
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  @Post()
  async create(@Body() dados: Partial<Embalagem>): Promise<Embalagem> {
    try {
      return await this.embalagensService.create(dados);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erro ao criar embalagem';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dados: Partial<Embalagem>): Promise<Embalagem> {
    try {
      return await this.embalagensService.update(id, dados);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      const message = error instanceof Error ? error.message : `Erro ao atualizar embalagem com id ${id}`;
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Embalagem> {
    try {
      return await this.embalagensService.delete(id);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      const message = error instanceof Error ? error.message : `Erro ao deletar embalagem com id ${id}`;
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }
}
