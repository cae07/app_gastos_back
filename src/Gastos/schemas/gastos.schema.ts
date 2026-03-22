import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GastosDocument = HydratedDocument<Gastos>;

@Schema({ timestamps: true }) 
export class Gastos {
  @Prop({ required: true })
  descricao!: string;

  @Prop({ required: true })
  valor!: number;

  @Prop({ required: true })
  tipoGastoId!: string;

  @Prop()
  ano?: number;

  @Prop()
  mes?: number;
}

export const GastosSchema = SchemaFactory.createForClass(Gastos);
