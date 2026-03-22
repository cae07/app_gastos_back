import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GastosController } from './gastos.controller';
import { GastosService } from './gastos.service';
import { GastosModel } from './gastos.model';
import { Gastos, GastosSchema } from './schemas/gastos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gastos.name, schema: GastosSchema }]),
  ],
  controllers: [GastosController],
  providers: [GastosService, GastosModel],
})
export class GastosModule {}
