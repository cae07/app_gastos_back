import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { TipoDeProdutoService } from './tiposDeProduto.service';
import { TiposDeProdutos } from './schemas/tiposDeProduto.schema';
import { throwHttpError } from '../utils/error.handler';

@Controller('tiposProduto')
export class TipoDeProdutoController {
  constructor(private readonly tipoDeProdutoService: TipoDeProdutoService) {}

  @Get()
  async getAll(@Query('ativa') ativa?: boolean): Promise<TiposDeProdutos[]> {
    try {
        if (ativa !== undefined) {
          return await this.tipoDeProdutoService.getAtivas(ativa);
        }
      return await this.tipoDeProdutoService.getAll();
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar tipos de produtos');
    }
  }

  @Get('/:tipoDeProdutoId')
  async getById(@Param('tipoDeProdutoId') tipoDeProdutoId: string): Promise<TiposDeProdutos | null> {
    try {
      return await this.tipoDeProdutoService.getById(tipoDeProdutoId);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar tipo de produto');
    }
  }

  @Post()
  async create(@Body() dados: Partial<TiposDeProdutos>): Promise<TiposDeProdutos> {
    try {
      return await this.tipoDeProdutoService.create(dados);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao criar tipo de produto');
    }
  }

  @Patch('/:tipoDeProdutoId')
  async update(
    @Param('tipoDeProdutoId') tipoDeProdutoId: string,
    @Body() dados: Partial<TiposDeProdutos>,
  ): Promise<TiposDeProdutos | null> {
    try {
      return await this.tipoDeProdutoService.update(tipoDeProdutoId, dados);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao atualizar tipo de produto');
    }
  }

  @Delete('/:tipoDeProdutoId')
  async delete(@Param('tipoDeProdutoId') tipoDeProdutoId: string): Promise<TiposDeProdutos | null> {
    try {
      return await this.tipoDeProdutoService.delete(tipoDeProdutoId);
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao deletar tipo de produto');
    }
  }
}
