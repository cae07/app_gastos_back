import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import express from 'express';

let cachedHandler: any;

async function bootstrap() {
  const startTime = Date.now();
  console.log('🚀 Bootstrap iniciando...');

  const expressApp = express();

  console.log('⏱️ Criando Express app:', Date.now() - startTime, 'ms');

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  console.log('⏱️ NestFactory.create completo:', Date.now() - startTime, 'ms');

  app.enableCors();
  await app.init();

  console.log('⏱️ App init completo:', Date.now() - startTime, 'ms');

  return serverless(expressApp);
}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedHandler) {
      console.log('[COLD START] Inicializando aplicação...');
      const start = Date.now();
      cachedHandler = await bootstrap();
      console.log('[COLD START] ✅ Completo em', Date.now() - start, 'ms');
    } else {
      console.log('[WARM START] Reutilizando handler cacheado');
    }
    return cachedHandler(req, res);
  } catch (err: any) {
    console.error('BOOTSTRAP_CRASH:', err?.stack || err);
    return res.status(500).json({
      error: 'BOOTSTRAP_CRASH',
      message: err?.message || String(err),
    });
  }
}
