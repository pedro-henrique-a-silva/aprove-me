import { Module } from '@nestjs/common';
import { PayableModule } from './integrations/payable/payable.module';
import { AssignorModule } from './integrations/assignor/assignor.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './integrations/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroServicoModule } from './integrations/micro-servico/micro-servico.module';

@Module({
  imports: [
    AuthModule,
    AssignorModule,
    PayableModule,
    MicroServicoModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d', algorithm: 'HS256' },
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:rabbitmq@rabbitmq:5672'],
          queue: 'payable_batch',
          queueOptions: {
            durable: true,
          },
          noAck: false,
        },
      },
    ]),
  ],
  providers: [PrismaService],
})
export class AppModule {}
