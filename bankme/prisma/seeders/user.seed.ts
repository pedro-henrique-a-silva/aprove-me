import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function userSeed() {
  await prisma.users.createMany({
    data: [
      {
        username: 'aproveme',
        password: await bcrypt.hash('aproveme', 10),
        // password: 'aproveme',
      },
    ],
  });
}
