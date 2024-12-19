import { Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import PayableRepository from './micro-servico.repository';
import { EmailService } from '../email/email.service';
import PayableCreationDto from '../payable/dto/PayableCreationDto';
import { DeadProducerService } from './dead-producer.service';
import Payable from '../entity/Payable';

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

      if (!assignor) {
        this.logger.error(`Assignor not found -> ${payableString}`);
        await this.deadProducerService.addToDeadQueue(payable);
        await this.emailService.sendFailurePaymentEmail(
          'Assignor not found',
          payable.value,
        );
        continue;
      }

      this.logger.log(`Trying new Payable -> ${payableString}`);
      while (!success && retries < this.maxAttempts) {
        try {
          const payableEntity = new Payable();

          payableEntity.value = payable.value;
          payableEntity.emissionDate = payable.emissionDate;
          payableEntity.assignorId = payable.assignorId;

          await this.payableRepository.createPayableRegister(payableEntity);

          success = true;
          this.emailService.sendSuccessPaymentEmail(
            assignor.name,
            payable.value,
          );

          this.logger.log(`Insert payable -> ${payableString}`);
        } catch (error) {
          this.logger.error(`Failed Inserting payable -> ${error}`);
          retries++;
        }
      }
      if (!success) {
        await this.deadProducerService.addToDeadQueue(payable);
        await this.emailService.sendFailurePaymentEmail(
          assignor.name,
          payable.value,
        );
      }
    }
  }
}
