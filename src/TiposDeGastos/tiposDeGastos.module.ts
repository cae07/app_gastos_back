import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoDeGastosController } from './tiposDeGastos.controller';
import { TipoDeGastosService } from './tiposDeGastos.service';
import { TiposDeGastosModel } from './tiposDeGastos.model';
import { TiposDeGastos, TiposDeGastosSchema } from './schemas/tiposDeGastos.schema';

@Module({
  imports: [
    // Registra o model neste módulo
    MongooseModule.forFeature([{ name: TiposDeGastos.name, schema: TiposDeGastosSchema }])
  ],
  controllers: [TipoDeGastosController],
  providers: [TipoDeGastosService, TiposDeGastosModel],
})
export class TipoDeGastosModule {}
