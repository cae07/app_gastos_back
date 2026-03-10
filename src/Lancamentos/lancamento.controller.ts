import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { LancamentoService } from './lancamento.service';
import { Lancamentos } from './schemas/lancamentos.schema';
import { throwHttpError } from '../utils/error.handler';

@Controller('lancamentos')
export class LancamentoController {
  constructor(private readonly lancamentoService: LancamentoService) {}

  @Get()
  async getAll(
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
    @Query('produtoId') produtoId?: string,
    @Query('categoria') categoria?: string,
    @Query('data_gte') data_gte?: string,
    @Query('data_lte') data_lte?: string,
    @Query('_sort') _sort?: string,
    @Query('_order') _order?: 'asc' | 'desc',
  ): Promise<Lancamentos[]> {
    try {
      const hasFilters = ano || mes || produtoId || categoria || data_gte || data_lte || _sort;
      if (hasFilters) {
        return await this.lancamentoService.getByFilters({
          ano, mes, produtoId, categoria, data_gte, data_lte, _sort, _order,
        });
      }
      return await this.lancamentoService.getAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar lançamentos';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  @Get('/:lancamentoId')
  async getById(@Param('lancamentoId') lancamentoId: string): Promise<Lancamentos | null> {
    try {
      return await this.lancamentoService.getById(lancamentoId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar lançamento';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  @Post()
  async create(@Body() dados: Partial<Lancamentos>): Promise<Lancamentos> {
    try {
      return await this.lancamentoService.create(dados);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar lançamento';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  @Patch('/:lancamentoId')
  async update(@Param('lancamentoId') lancamentoId: string, @Body() dados: Partial<Lancamentos>): Promise<Lancamentos | null> {
    try {
      return await this.lancamentoService.update(lancamentoId, dados);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar lançamento';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  @Delete('/:lancamentoId')
  async delete(@Param('lancamentoId') lancamentoId: string): Promise<Lancamentos | null> {
    try {
      return await this.lancamentoService.delete(lancamentoId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao deletar lançamento';
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }
}
