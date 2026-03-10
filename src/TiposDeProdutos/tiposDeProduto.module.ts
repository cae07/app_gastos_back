import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoDeProdutoController } from './tiposDeProduto.controller';
import { TipoDeProdutoService } from './tiposDeProduto.service';
import { TiposDeProdutosModel } from './tiposDeProduto.model';
import { TiposDeProdutos, TiposDeProdutosSchema } from './schemas/tiposDeProduto.schema';

@Module({
  imports: [
    // Registra o model neste módulo
    MongooseModule.forFeature([{ name: TiposDeProdutos.name, schema: TiposDeProdutosSchema }])
  ],
  controllers: [TipoDeProdutoController],
  providers: [TipoDeProdutoService, TiposDeProdutosModel],
})
export class TipoDeProdutoModule {}
