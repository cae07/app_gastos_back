import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TiposDeGastosDocument = HydratedDocument<TiposDeGastos>;

@Schema({ timestamps: true }) 
export class TiposDeGastos {
  @Prop({ required: true })
  nome!: string;

  @Prop({ required: true })
  descricao!: string;

  @Prop({ required: true })
  ativa!: boolean;
}

export const TiposDeGastosSchema = SchemaFactory.createForClass(TiposDeGastos);
