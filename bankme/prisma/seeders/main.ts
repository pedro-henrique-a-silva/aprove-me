import { PrismaClient } from '@prisma/client';
import assignorSeed from './assignor.seed';
import payableSeed from './payable.seed';
import userSeed from './user.seed';

const prisma = new PrismaClient();

async function main() {
  await userSeed();
  await assignorSeed();
  await payableSeed();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
