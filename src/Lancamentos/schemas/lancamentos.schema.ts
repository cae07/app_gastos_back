import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LancamentosDocument = HydratedDocument<Lancamentos>;

@Schema({ timestamps: true }) 
export class Lancamentos {
  @Prop({ required: true })
  produtoId!: string;

  @Prop({ required: true })
  produtoName!: string;

  @Prop({ required: true })
  quantity!: number;

  @Prop({ required: true })
  value!: number;

  @Prop({ required: true })
  ano!: number;

  @Prop({ required: true })
  embalagemId!: string;
  
  @Prop({ required: true })
  mes!: number;

  @Prop({ required: true })
  categoria!: string;

  @Prop({ required: true })
  mesNome!: string;
}

export const LancamentosSchema = SchemaFactory.createForClass(Lancamentos);
