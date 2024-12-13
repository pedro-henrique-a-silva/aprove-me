import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './micro-servico.controller';
import { MicroServicoService } from './micro-servico-consumer.service';

describe('PayableController', () => {
  let controller: PayableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [MicroServicoService],
    }).compile();

    controller = module.get<PayableController>(PayableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
