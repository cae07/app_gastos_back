import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import express from 'express';

let cachedHandler: any;

async function bootstrap() {
  const expressApp = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableCors();
  await app.init();

  return serverless(expressApp);
}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedHandler) {
      cachedHandler = await bootstrap();
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
``
