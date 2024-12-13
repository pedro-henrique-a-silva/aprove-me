import { MicroServicoService } from './micro-servico-consumer.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

@Controller()
export class MicroServicoController {
  constructor(private readonly payableService: MicroServicoService) {}

  @MessagePattern('payable_queue')
  async processPayable(@Ctx() context: RmqContext) {
    const message = context.getMessage();
    const content = JSON.parse(message.content);

    const { payables } = content;
    await this.payableService.processPayable(payables);
    return;
  }
}
