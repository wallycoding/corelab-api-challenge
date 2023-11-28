import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const randomSize = (size: number) => Math.floor(Math.random() * size);
const total = 30;
const colors = [
  'light-gray',
  'light-blue',
  'beige',
  'mint-green',
  'sky-blue',
  'dove-gray',
  'light-green',
  'light-purple',
  'light-red',
  'light-orange',
  'light-peach',
  'light-yellow',
];

const main = async () => {
  await prisma.note.createMany({
    data: Array.from({ length: total }, () => ({
      title: faker.vehicle.vehicle(),
      description: faker.lorem.paragraphs(),
      hasFavorited: !randomSize(2),
      color: randomSize(2) ? null : colors[randomSize(colors.length)],
    })),
  });
  console.log('-===[ Finish ]===-');
};

main();
