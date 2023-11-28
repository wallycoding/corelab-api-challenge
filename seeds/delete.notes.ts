import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  await prisma.note.deleteMany();
  console.log('-===[ Finish ]===-');
};

main();
