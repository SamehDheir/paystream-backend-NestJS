import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false, // true for 465, false for 587
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendTransactionAlert(to: string, data: any) {
    const { type, amount, userId, balanceAfter } = data;
    const isDeposit = type.toLowerCase() === 'deposit';
    const accentColor = isDeposit ? '#28a745' : '#dc3545';

    try {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to: to,
        subject: `🔔 PayStream Alert: ${isDeposit ? 'Deposit' : 'Withdrawal'} Successful`,
        html: `
        <!DOCTYPE html>
        <html dir="ltr">
        <head>
          <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; }
            .header { background-color: #1a1a1a; color: #ffffff; padding: 20px; text-align: center; }
            .content { padding: 30px; line-height: 1.6; color: #333; }
            .amount-box { background-color: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; border-left: 5px solid ${accentColor}; }
            .amount { font-size: 28px; font-weight: bold; color: ${accentColor}; }
            .details { font-size: 14px; color: #666; margin-top: 10px; }
            .footer { background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888; }
            .btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">PayStream</h1>
            </div>
            <div class="content">
              <h3>Transaction Confirmed</h3>
              <p>Hello,</p>
              <p>We are notifying you that a <strong>${type.toUpperCase()}</strong> has been successfully processed on your account.</p>
              
              <div class="amount-box">
                <div style="font-size: 14px; color: #666;">Transaction Amount</div>
                <div class="amount">${isDeposit ? '+' : '-'}$${amount}</div>
                <div class="details">New Balance: $${balanceAfter}</div>
              </div>

              <p><strong>User ID:</strong> ${userId}<br>
              <strong>Date:</strong> ${new Date().toLocaleString()}</p>
              
              <p>If you did not authorize this activity, please secure your account immediately.</p>
              
              <a href="#" class="btn">View Account Activity</a>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} PayStream Fintech. All rights reserved.<br>
              This is an automated security notification.
            </div>
          </div>
        </body>
        </html>
        `,
      });
      this.logger.log(`📧 Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${to}`, error.stack);
    }
  }
}