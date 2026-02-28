import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationServiceModule } from './notification-service.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../..', '.env') });
async function bootstrap() {
  const user = process.env.RABBITMQ_USER;
  const pass = process.env.RABBITMQ_PASS;
  const host = process.env.RABBITMQ_HOST;
  const port = process.env.RABBITMQ_PORT;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${pass}@${host}:${port}`],
        queue: 'notification_queue',
        queueOptions: { durable: true },
      },
    },
  );
  await app.listen();
  console.log('🔔 Notification Service is listening...');
}
bootstrap();
