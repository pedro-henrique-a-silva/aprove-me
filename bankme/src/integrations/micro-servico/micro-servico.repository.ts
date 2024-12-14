import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Payable from '../entity/Payable';
import Assignor from '../entity/Assignor';

@Injectable()
export default class PayableRepository {
  constructor(private prismaService: PrismaService) {}

  async createPayableRegister(payable: Payable): Promise<Payable> {
    const payableRegister = await this.prismaService.payable.create({
      data: payable.toCreate(),
      include: {
        assignor: true,
      },
    });

    const payableToReturn = new Payable(
      payableRegister.id,
      payableRegister.value,
      payableRegister.emissionDate,
      payableRegister.assignorId,
    );

    return payableToReturn;
  }

  async findAssignorById(assignorId: string): Promise<Assignor> {
    const assignor = await this.prismaService.assignor.findUnique({
      where: {
        id: assignorId,
      },
    });

    const assignorToReturn = new Assignor();

    assignorToReturn.id = assignor.id;
    assignorToReturn.document = assignor.document;
    assignorToReturn.email = assignor.email;
    assignorToReturn.phone = assignor.phone;
    assignorToReturn.name = assignor.name;
    assignorToReturn.active = assignor.active;

    return assignorToReturn;
  }
}
