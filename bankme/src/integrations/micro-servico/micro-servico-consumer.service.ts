import { Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import PayableRepository from './micro-servico.repository';
import { EmailService } from '../email/email.service';
import PayableCreationDto from '../payable/dto/PayableCreationDto';
import { DeadProducerService } from './dead-producer.service';

@Injectable()
export class MicroServicoService {
  private readonly maxAttempts = 3;
  private itemsReport = {};
  private channelWrapper: ChannelWrapper;

  private readonly logger = new Logger(MicroServicoService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly payableRepository: PayableRepository,
    private readonly deadProducerService: DeadProducerService,
  ) {
    const connection = amqp.connect(['amqp://admin:admin@rabbitmq:5672']);
    this.channelWrapper = connection.createChannel();
  }

  async processPayable(payload: PayableCreationDto[]) {
    for (const payable of payload) {
      const payableString = JSON.stringify(payable);
      let retries = 0;
      let success = false;
      const assignor = await this.payableRepository.findAssignorById(
        payable.assignorId,
      );

      Logger.log(`Trying new Payable -> ${payableString}`);
      while (!success && retries < this.maxAttempts) {
        try {
          await this.payableRepository.createPayableRegister(
            payable.toEntity(),
          );

          success = true;
          this.emailService.sendSuccessPaymentEmail(
            assignor.email,
            assignor.name,
            payable.value,
          );

          Logger.log(`Insert payable -> ${payableString}`);
        } catch (error) {
          retries++;
        }
      }
      if (!success) {
        await this.deadProducerService.addToDeadQueue(payable);
        await this.emailService.sendSuccessPaymentEmail(
          assignor.email,
          assignor.name,
          payable.value,
        );
      }
    }
  }
}
