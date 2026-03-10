import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MedidaDocument = HydratedDocument<Medida>;

@Schema({ timestamps: true }) 
export class Medida {
  @Prop({ required: true })
  nome!: string;

  @Prop({ required: true })
  sigla!: string;

  @Prop({ required: true })
  ativa!: boolean;
}

export const MedidaSchema = SchemaFactory.createForClass(Medida);
