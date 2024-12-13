import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendSuccessPaymentEmail(
    email: string,
    name: string,
    value: number,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: process.env.TO,
        subject: 'Pagamento Processado com sucesso',
        template: 'success-payment',
        context: {
          name,
          value,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new ServiceUnavailableException(
        'Email service is temporarily unavailable. Please try again later.',
      );
    }
  }

  async sendFailurePaymentEmail(
    email: string,
    name: string,
    value: number,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: process.env.TO,
        subject: 'O Processamento do seu pagmento falhou',
        template: 'failed-payment',
        context: {
          name,
          value,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new ServiceUnavailableException(
        'Email service is temporarily unavailable. Please try again later.',
      );
    }
  }
}
