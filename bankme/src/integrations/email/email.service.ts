import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendSuccessPaymentEmail(name: string, value: number): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: process.env.SMTP_TO,
        subject: 'Pagamento Processado com sucesso',
        template: 'success-payment',
        context: {
          name,
          value,
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        'Email service is temporarily unavailable. Please try again later.',
      );
    }
  }

  async sendFailurePaymentEmail(name: string, value: number): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: process.env.SMTP_TO,
        subject: 'O Processamento do seu pagmento falhou',
        template: 'failed-payment',
        context: {
          name,
          value,
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        'Email service is temporarily unavailable. Please try again later.',
      );
    }
  }
}
