// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './Health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ✅ APENAS MongoDB GLOBAL (sem conectar ainda)
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
          autoConnect: false,  // ✅ NÃO conecta automaticamente
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
          bufferCommands: false,
          socketTimeoutMS: 45000,
          maxPoolSize: 1,
          minPoolSize: 0,
          retryWrites: true,
        };
      },
    }),

    // ✅ APENAS Health para serverless rodar rápido
    HealthModule,
    
    // ⏸️ OUTROS MÓDULOS COMENTADOS (carregaremos lazy loading depois)
    // ProductModule,
    // LancamentoModule,
    // TipoDeProdutoModule,
    // MedidasModule,
    // EmbalagensModule,
    // TipoDeGastosModule,
    // GastosModule,
  ],
})
export class AppModule {}
