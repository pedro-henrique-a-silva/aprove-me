import { MicroServicoService } from './micro-servico-consumer.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import PayableCreationDto from '../payable/dto/PayableCreationDto';

@Controller('microserviço')
export class PayableController {
  constructor(private readonly payableService: MicroServicoService) {}

  @EventPattern('payable_batch')
  async processPayable(@Payload() payload: PayableCreationDto[]) {
    await this.payableService.processPayable(payload);
    return;
  }
}
