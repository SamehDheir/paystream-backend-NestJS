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

    const recipientEmail = data.email;

    if (!recipientEmail) {
      console.error('❌ No email found in the transaction data!');
      return;
    }

    try {
      await this.emailService.sendTransactionAlert(
        recipientEmail, 
        data,
      );
      console.log(`✅ The email was sent successfully to: ${recipientEmail}`);
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
    }
  }
}