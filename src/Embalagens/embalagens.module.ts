import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmbalagensController } from './embalagens.controller';
import { EmbalagensService } from './embalagens.service';
import { EmbalagensModel } from './embalagens.model';
import { Embalagens, EmbalagensSchema } from './schemas/embalagens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Embalagens.name, schema: EmbalagensSchema }]),
  ],
  controllers: [EmbalagensController],
  providers: [EmbalagensService, EmbalagensModel],
})
export class EmbalagensModule {}
