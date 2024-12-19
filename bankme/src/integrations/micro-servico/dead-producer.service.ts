import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import PayableCreationDto from '../payable/dto/PayableCreationDto';

const RABBITMQ_USER = process.env.RABBITMQ_USER;
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;
const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
const RABBITMQ_PORT = process.env.RABBITMQ_PORT;

@Injectable()
export class DeadProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect([
      `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`,
    ]);
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
