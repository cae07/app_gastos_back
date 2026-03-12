import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmbalagemDocument = HydratedDocument<Embalagem>;

@Schema({ timestamps: true }) 
export class Embalagem {
  @Prop({ required: true })
  quantidade!: number;

  @Prop({ required: true })
  ativa!: boolean;
}

export const EmbalagemSchema = SchemaFactory.createForClass(Embalagem);
