import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function payableSeed() {
  await prisma.payable.createMany({
    data: [
      {
        assignorId: '9fe7de00-6f6c-45e2-8dfe-737f945614ef',
        value: 1000,
        emissionDate: new Date(),
      },
      {
        assignorId: '9fe7de00-6f6c-45e2-8dfe-737f945614ef',
        value: 100,
        emissionDate: new Date(),
      },
      {
        assignorId: '9fe7de00-6f6c-45e2-8dfe-737f945614ef',
        value: 2000,
        emissionDate: new Date(),
      },
    ],
  });
}
