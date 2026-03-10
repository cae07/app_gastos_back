import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LancamentoController } from './lancamento.controller';
import { LancamentoService } from './lancamento.service';
import { LancamentosModel } from './lancamento.model';
import { Lancamentos, LancamentosSchema } from './schemas/lancamentos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lancamentos.name, schema: LancamentosSchema }]),
  ],
  controllers: [LancamentoController],
  providers: [LancamentoService, LancamentosModel],
})
export class LancamentoModule {}
