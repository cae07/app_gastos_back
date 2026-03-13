import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmbalagensController } from './embalagens.controller';
import { EmbalagensService } from './embalagens.service';
import { EmbalagensModel } from './embalagens.model';
import { Embalagem, EmbalagemSchema } from './schemas/embalagens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Embalagem.name, schema: EmbalagemSchema }]),
  ],
  controllers: [EmbalagensController],
  providers: [EmbalagensService, EmbalagensModel],
})
export class EmbalagensModule {}
