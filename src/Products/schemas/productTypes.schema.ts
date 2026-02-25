import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductTypesDocument = HydratedDocument<ProductTypes>;

@Schema({ timestamps: true }) 
export class ProductTypes {
  @Prop({ required: true })
  nome!: string;

  @Prop({ required: true })
  descricao!: string;

  @Prop({ required: true })
  ativa!: string;
}

export const ProductTypesSchema = SchemaFactory.createForClass(ProductTypes);
