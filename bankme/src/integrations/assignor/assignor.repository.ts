import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import Assignor from '../entity/Assignor';
import { IAssignor } from '../types/IAssignor';

@Injectable()
export default class AssignorRepository {
  constructor(private prismaService: PrismaService) {}

  async createAssignorRegister(assignor: Assignor): Promise<IAssignor> {
    const assignorFromDB = await this.findAssignorByDocument(assignor.document);

    if (assignorFromDB) {
      return assignorFromDB;
    }

    const createdAssignor = await this.prismaService.assignor.create({
      data: assignor.toCreate(),
    });

    return createdAssignor;
  }

  async findAssignorByDocument(document: string): Promise<IAssignor | null> {
    const assignor = await this.prismaService.assignor.findFirst({
      where: {
        document,
      },
    });

    return assignor;
  }
}
