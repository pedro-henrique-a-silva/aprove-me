import { Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import PayableRepository from './micro-servico.repository';
import { EmailService } from '../email/email.service';
import PayableCreationDto from '../payable/dto/PayableCreationDto';
import { DeadProducerService } from './dead-producer.service';
import Payable from '../entity/Payable';

const RABBITMQ_USER = process.env.RABBITMQ_USER;
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;
const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
const RABBITMQ_PORT = process.env.RABBITMQ_PORT;

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
    const connection = amqp.connect([
      `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`,
    ]);
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
