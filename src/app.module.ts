// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './Products/product.module';
import { LancamentoModule } from './Lancamentos/lancamento.module';
import { MedidasModule } from './Medidas/medidas.module';
import { TipoDeProdutoModule } from './TiposDeProdutos/tiposDeProduto.module';
import { EmbalagensModule } from './Embalagens/embalagens.module';
import { TipoDeGastosModule } from './TiposDeGastos/tiposDeGastos.module';
import { GastosModule } from './Gastos/gastos.module';
import { HealthModule } from './Health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');

        if (!uri) {
          throw new Error('MONGO_URI não definida nas variáveis de ambiente.');
        }

        return {
          uri,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
          // Buffer para serverless (evita reconectar a cada request)
          bufferCommands: false,
          socketTimeoutMS: 45000,
        };
      },
    }),

    HealthModule,
    ProductModule,
    LancamentoModule,
    TipoDeProdutoModule,
    MedidasModule,
    EmbalagensModule,
    TipoDeGastosModule,
    GastosModule,
  ],
})
export class AppModule {}
