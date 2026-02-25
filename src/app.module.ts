// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './Products/product.module';

@Module({
  imports: [
    // 1. Carrega o .env
    ConfigModule.forRoot(), 
    
    // 2. Conecta ao MongoDB usando a variável de ambiente
    MongooseModule.forRoot(
      `mongodb+srv://app_gastos:${process.env.MONGO_PASS}@appgastos.t7dvur7.mongodb.net/market?retryWrites=true&w=majority`
    ),
    
    ProductModule,
  ],
})
export class AppModule {}
