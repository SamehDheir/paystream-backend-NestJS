// apps/ledger-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LedgerServiceModule } from './ledger-service.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // استيراد الـ ConfigService
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(LedgerServiceModule);

  const configService = app.get(ConfigService);

  const user = configService.get('RABBITMQ_USER');
  const pass = configService.get('RABBITMQ_PASS');
  const host = configService.get('RABBITMQ_HOST');
  const port = configService.get('RABBITMQ_PORT');
  const httpPort = configService.get('LEDGER_PORT') || 3001;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${pass}@${host}:${port}`],
      queue: 'ledger_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  try {
    await app.startAllMicroservices();
    logger.log('✅ RabbitMQ Microservice connection established');
  } catch (error) {
    logger.error('❌ Failed to start microservices:', error);
  }

  await app.listen(httpPort);
  logger.log(`🚀 Ledger HTTP server is running on port ${httpPort}`);
}

bootstrap();