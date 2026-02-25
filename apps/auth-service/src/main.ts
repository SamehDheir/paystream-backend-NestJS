import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.use(cookieParser());
  await app.listen(3002);
  console.log('Auth Service is running on: http://localhost:3002');
}
bootstrap();
