import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedidasController } from './medidas.controller';
import { MedidasService } from './medidas.service';
import { MedidaModel } from './medidas.model';
import { Medida, MedidaSchema } from './schemas/medidas.schema';

@Module({
  imports: [
    // Registra o model neste módulo
    MongooseModule.forFeature([{ name: Medida.name, schema: MedidaSchema }])
  ],
  controllers: [MedidasController],
  providers: [MedidasService, MedidaModel],
})
export class MedidasModule {}
