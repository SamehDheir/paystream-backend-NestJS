import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [NotificationServiceController],
  providers: [EmailService],
})
export class NotificationServiceModule {}
