import { Module } from '@nestjs/common';
import { PayableModule } from './integrations/payable/payable.module';
import { AssignorModule } from './integrations/assignor/assignor.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './integrations/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroServicoModule } from './integrations/micro-servico/micro-servico.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './integrations/shared/guards/auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';
const templatePath = isDevelopment
  ? join(__dirname, '../../', 'src/templates')
  : join(__dirname, 'templates');

@Module({
  imports: [
    AuthModule,
    AssignorModule,
    PayableModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: {
        expiresIn: `${process.env.JWT_EXPIRES_IN}`,
        algorithm: 'HS256',
      },
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@rabbitmq:5672'],
          queue: 'payable_queue',
          queueOptions: {
            durable: true,
          },
          noAck: false,
        },
      },
    ]),
    MicroServicoModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM,
      },
      template: {
        dir: join(templatePath),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
