import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/products.schema';

@Injectable()
export class ProductsModel {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<ProductDocument>,
  ) {}

  async salvar(dados: Partial<Product>): Promise<Product> {
    const novo = new this.model(dados);
    return novo.save();
  }

  async getAll(): Promise<Product[]> {
    return this.model.find().exec();
  }

  async getById(id: string): Promise<Product | null> {
    return this.model.findById(id).exec();
  }

  async update(productId: string, dados: Partial<Product>): Promise<Product | null> {
    return this.model.findByIdAndUpdate(productId, dados, { returnDocument: 'after' }).exec();
  }

  async delete(productId: string): Promise<Product | null> {
    return this.model.findByIdAndDelete(productId).exec();
  }

  async getByType(productType: string): Promise<Product[]> {
    return this.model.find({ productType }).exec();
  }
}
