import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import PayableCreationDto from '../payable/dto/PayableCreationDto';

@Injectable()
export class DeadProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect(['amqp://admin:admin@rabbitmq:5672']);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('dead_queue', { durable: true });
      },
    });
  }

  async addToDeadQueue(payable: PayableCreationDto) {
    try {
      const message = JSON.stringify({
        pattern: 'dead_queue',
        payable,
      });
      await this.channelWrapper.sendToQueue(
        'dead_queue',
        Buffer.from(message),
        {
          persistent: true,
        } as any,
      );
    } catch (error) {
      throw new HttpException(
        'Error sending payable to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
