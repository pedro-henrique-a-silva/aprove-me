import { Module } from '@nestjs/common';
import { MicroServicoService } from './micro-servico-consumer.service';
import { PayableController } from './micro-servico.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import PayableRepository from './micro-servico.repository';
import { DeadProducerService } from './dead-producer.service';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [PayableController],
  providers: [
    MicroServicoService,
    PayableRepository,
    EmailService,
    DeadProducerService,
  ],
})
export class MicroServicoModule {}
