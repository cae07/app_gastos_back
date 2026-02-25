import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true }) 
export class Product {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  measure!: string;

  @Prop({ required: true })
  medidaId!: string;

  @Prop({ required: true })
  productType!: string;

  @Prop({ required: true })
  tipoProdutoId!: string;

  @Prop({ required: true })
  embalagemId!: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
