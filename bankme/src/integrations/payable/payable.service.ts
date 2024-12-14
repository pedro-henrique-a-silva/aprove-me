import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Payable from '../entity/Payable';
import PayableRepository from './payable.repository';
import { IPayable } from '../types/IPayables';
import PayableDto from './dto/PayableDto';
import PayableCreationDto from './dto/PayableCreationDto';
import { AssignorJwtPayload } from '../types';
import { AssignorService } from '../assignor/assignor.service';
import amqp, { Channel, ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class PayableService {
  private channelWrapper: ChannelWrapper;
  constructor(
    private payableRepository: PayableRepository,
    private assignorService: AssignorService,
  ) {
    const connection = amqp.connect(['amqp://admin:admin@rabbitmq:5672']);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('payable_queue', { durable: true });
      },
    });
  }

  async createPayableRegister(payable: Payable): Promise<IPayable> {
    const createdPayable =
      await this.payableRepository.createPayableRegister(payable);

    return PayableDto.fromEntity(createdPayable);
  }

  async findAllPayables(assignorId) {
    const payables = await this.payableRepository.findAllPayables(assignorId);

    return payables.map((payable) => PayableDto.fromEntity(payable));
  }

  async findPayableById(id: string) {
    const payable = await this.payableRepository.findPayableById(id);

    if (!payable) {
      throw new HttpException('Payable not found.', HttpStatus.NOT_FOUND);
    }

    return PayableDto.fromEntity(payable);
  }

  async updatePayableById(id: string, payable: Payable, email: string) {
    const payableFound = await this.payableRepository.findPayableById(id);

    if (!payableFound) {
      throw new HttpException('Payable not found.', HttpStatus.NOT_FOUND);
    }

    await this.verifyAuthority(email, payableFound.assignorId);

    const updatedPayable = await this.payableRepository.updatePayableById(
      id,
      payable,
    );

    return PayableDto.fromEntity(updatedPayable);
  }

  async deletePayableById(id: string, email: string) {
    const payable = await this.payableRepository.findPayableById(id);

    if (!payable) {
      throw new HttpException('Payable not found.', HttpStatus.NOT_FOUND);
    }

    await this.verifyAuthority(email, payable.assignorId);

    await this.payableRepository.deletePayableById(id);
    return;
  }

  async processBatch(
    batchData: PayableCreationDto[],
    user: AssignorJwtPayload,
  ) {
    const assignor = await this.assignorService.findAssignorByEmail(user.sub);

    if (!assignor) {
      throw new HttpException('Assignor not found.', HttpStatus.NOT_FOUND);
    }

    try {
      const message = JSON.stringify({
        pattern: 'payable_queue',
        payables: batchData,
      });

      this.channelWrapper.sendToQueue('payable_queue', Buffer.from(message), {
        persistent: true,
      } as any);
      console.log('enviado para a fila');
    } catch (error) {
      throw new InternalServerErrorException('Error sending payable to queue');
    }

    // this.client.emit('payable_batch', batchData);
  }

  private async verifyAuthority(email: string, assignorId: string) {
    const assignor = await this.assignorService.findAssignorByEmail(email);

    if (!assignor) {
      throw new HttpException('Assignor not found.', HttpStatus.NOT_FOUND);
    }

    if (assignor.id !== assignorId) {
      throw new HttpException(
        'Assignor not allowed to do this operation.',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
