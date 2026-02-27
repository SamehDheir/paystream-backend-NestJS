import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendTransactionAlert(to: string, data: any) {
    const { type, email,amount, userId } = data;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),

      to: email,

      subject: `Financial Transaction Alert: ${type}`,

      html: `

<div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">

<h2>New PayStream Notification</h2>

<p>Dear User <strong>${userId}</strong>,</p>

<p>The transaction <strong>${type === 'deposit' ? 'Deposit' : 'Withdrawal'}</strong> was executed successfully.</p>

<p>Amount: <span style="color: green;">$${amount}</span></p>

<hr>

<small>If you did not perform this transaction, please contact technical support.</small>

</div>

`,
    });
  }
}
