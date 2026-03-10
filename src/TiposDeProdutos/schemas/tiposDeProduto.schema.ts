import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TiposDeProdutosDocument = HydratedDocument<TiposDeProdutos>;

@Schema({ timestamps: true }) 
export class TiposDeProdutos {
  @Prop({ required: true })
  nome!: string;

  @Prop({ required: true })
  descricao!: string;

  @Prop({ required: true })
  ativa!: boolean;
}

export const TiposDeProdutosSchema = SchemaFactory.createForClass(TiposDeProdutos);
