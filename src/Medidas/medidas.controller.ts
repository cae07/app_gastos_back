import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { MedidasService } from './medidas.service';
import { Medida } from './schemas/medidas.schema';
import { throwHttpError } from '../utils/error.handler';

@Controller('medidas')
export class MedidasController {
    constructor(private readonly medidasService: MedidasService) {}

    @Get() 
    async getAll(@Query('ativa') ativa?: boolean): Promise<Medida[]> {
        try {
            if (ativa !== undefined) {
                return await this.medidasService.getByAtiva(ativa);
            }
            return await this.medidasService.getAll();
        } catch (error) {
            if (error instanceof Error && 'status' in error) {
                throw error;
            }
            throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar medidas');
        }
    }

    @Get('/:medidaId')
    async getById(@Param('medidaId') medidaId: string): Promise<Medida | null> {
        try {
            return await this.medidasService.getById(medidaId);
        } catch (error) {
            if (error instanceof Error && 'status' in error) {
                throw error;
            }
            throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao buscar medida');
        }
    }

    @Post()
    async criarMedida(@Body() dados: Partial<Medida>): Promise<Medida> {
        try {
            return await this.medidasService.criarMedida(dados);
        } catch (error) {
            if (error instanceof Error && 'status' in error) {
                throw error;
            }
            throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao criar medida');
        }
    }

    @Patch('/:medidaId')
    async update(@Param('medidaId') medidaId: string, @Body() dados: Partial<Medida>): Promise<Medida | null> {
        try {
            return await this.medidasService.update(medidaId, dados);
        } catch (error) {
            if (error instanceof Error && 'status' in error) {
                throw error;
            }
            throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao atualizar medida');
        }
    }

    @Delete('/:medidaId')
    async deletarMedida(@Param('medidaId') medidaId: string): Promise<Medida | null> {
        try {
            return await this.medidasService.deletarMedida(medidaId);
        } catch (error) {
            if (error instanceof Error && 'status' in error) {
                throw error;
            }
            throwHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Erro ao deletar medida');
        }
    }
}
