// apps/ledger-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LedgerServiceModule } from './ledger-service.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(LedgerServiceModule);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@127.0.0.1:5672'],
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
    logger.log('✅ RabbitMQ Microservice connection attempt started');
  } catch (error) {
    logger.error('❌ Failed to start microservices:', error);
  }

  await app.listen(3001);
  logger.log('🚀 Ledger HTTP server is running on port 3001');
}
bootstrap();
