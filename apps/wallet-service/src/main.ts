import { NestFactory } from '@nestjs/core';
import { WalletServiceModule } from './wallet-service.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(WalletServiceModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      
    forbidNonWhitelisted: true, 
    transform: true,
  }));
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
