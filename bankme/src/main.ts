import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Bankme API')
    .setDescription('This is the Bankme API documentation')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@rabbitmq:5672'],
      queue: 'payable_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
