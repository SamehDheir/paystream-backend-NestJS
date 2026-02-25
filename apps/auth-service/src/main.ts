import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AuthServiceModule } from './auth-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('PayStream Auth Service')
    .setDescription('User Registration & Authentication (JWT + Cookies)')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3002);
  console.log('Auth Service is running on: http://localhost:3002');
}
bootstrap();
