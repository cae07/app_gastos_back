import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { TipoDeGastosService } from './tiposDeGastos.service';
import { TiposDeGastos } from './schemas/tiposDeGastos.schema';
import { throwHttpError } from '../utils/error.handler';

@Controller('tiposDeGastos')
export class TipoDeGastosController {
  constructor(private readonly tipoDeGastosService: TipoDeGastosService) {}

  @Get()
  async getAll(@Query('ativa') ativa?: boolean): Promise<TiposDeGastos[]> {
    try {
        if (ativa !== undefined) {
          return await this.tipoDeGastosService.getAtivas(ativa);
        }
      return await this.tipoDeGastosService.getAll();
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar tipos de Gastos');
    }
  }

  @Get('/:tipoDeGastosId')
  async getById(@Param('tipoDeGastosId') tipoDeGastoId: string): Promise<TiposDeGastos | null> {
    try {
      return await this.tipoDeGastosService.getById(tipoDeGastoId);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar tipo de Gastos');
    }
  }

  @Post()
  async create(@Body() dados: Partial<TiposDeGastos>): Promise<TiposDeGastos> {
    try {
      return await this.tipoDeGastosService.create(dados);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao criar tipo de Gasto');
    }
  }

  @Patch('/:tipoDeGastosId')
  async update(
    @Param('tipoDeGastosId') tipoDeGastosId: string,
    @Body() dados: Partial<TiposDeGastos>,
  ): Promise<TiposDeGastos | null> {
    try {
      return await this.tipoDeGastosService.update(tipoDeGastosId, dados);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao atualizar tipo de Gastos');
    }
  }

  @Delete('/:tipoDeGastosId')
  async delete(@Param('tipoDeGastosId') tipoDeGastosId: string): Promise<TiposDeGastos | null> {
    try {
      return await this.tipoDeGastosService.delete(tipoDeGastosId);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao deletar tipo de Gastos');
    }
  }
}
