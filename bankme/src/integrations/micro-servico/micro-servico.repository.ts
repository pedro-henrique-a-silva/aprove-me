import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Payable from '../entity/Payable';
import Assignor from '../entity/Assignor';

@Injectable()
export default class PayableRepository {
  constructor(private prismaService: PrismaService) {}

  async createPayableRegister(
    payable: Payable,
  ): Promise<{ payable: Payable; assignor: Assignor }> {
    const payableRegister = await this.prismaService.payable.create({
      data: payable.toCreate(),
      include: {
        assignor: true,
      },
    });

    const assignorToReturn = new Assignor();

    assignorToReturn.id = payableRegister.assignor.id;
    assignorToReturn.document = payableRegister.assignor.document;
    assignorToReturn.email = payableRegister.assignor.email;
    assignorToReturn.password = payableRegister.assignor.password;
    assignorToReturn.phone = payableRegister.assignor.phone;
    assignorToReturn.name = payableRegister.assignor.name;
    assignorToReturn.active = payableRegister.assignor.active;

    const payableToReturn = new Payable(
      payableRegister.id,
      payableRegister.value,
      payableRegister.emissionDate,
      payableRegister.assignorId,
    );

    return {
      payable: payableToReturn,
      assignor: assignorToReturn,
    };
  }
}
