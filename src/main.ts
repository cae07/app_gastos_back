import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const PORT = process.env.PORT || 3002;
  await app.listen(PORT);
  log(`Servidor rodando na porta ${PORT}`);
}
bootstrap();
