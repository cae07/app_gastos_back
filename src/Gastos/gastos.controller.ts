import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { Gastos } from './schemas/gastos.schema';
import { throwHttpError } from '../utils/error.handler';

@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Get()
  async getAll(): Promise<Gastos[]> {
    try {
      return await this.gastosService.getAll();
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar Gastos');
    }
  }

  @Get('/:gastoId')
  async getById(@Param('gastoId') gastoId: string): Promise<Gastos | null> {
    try {
      return await this.gastosService.getById(gastoId);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar Gasto');
    }
  }

  @Post()
  async create(@Body() dados: Partial<Gastos>): Promise<Gastos> {
    try {
      return await this.gastosService.create(dados);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao criar Gasto');
    }
  }

  @Patch('/:gastoId')
  async update(
    @Param('gastoId') gastoId: string,
    @Body() dados: Partial<Gastos>,
  ): Promise<Gastos | null> {
    try {
      return await this.gastosService.update(gastoId, dados);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao atualizar Gasto');
    }
  }

  @Delete('/:gastoId')
  async delete(@Param('gastoId') gastoId: string): Promise<Gastos | null> {
    try {
      return await this.gastosService.delete(gastoId);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao deletar Gasto');
    }
  }
}
