import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller()
export class NotificationServiceController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('transaction_created')
  async handleTransactionCreated(@Payload() data: any) {
    console.log(
      '📧 Processing the email notification for the transaction:',
      data,
    );

    try {
      await this.emailService.sendTransactionAlert(
        'your-personal-email@gmail.com',
        data,
      );
      console.log('✅ The email was sent successfully!');
    } catch (error) {
      console.error('❌ Email sending failed:', error);
    }
  }
}
