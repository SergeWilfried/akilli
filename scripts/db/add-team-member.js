/* eslint-disable @typescript-eslint/no-var-requires */

const { PrismaClient } = require('@prisma/client');

async function run() {
  const prisma = new PrismaClient();
  // use `prisma` in your application to read and write data in your DB
  try {
    return await prisma.transcriber.upsert({
      create: {
        teamId: '3993ae8c-1c2d-405c-8231-a60a1587c091',
        userId: 'c2d36b2e-857e-44a9-8094-1e4c1549a36e',
        role: 'TRANSCRIBER',
        email: 'info@boxyhq.io',
        name: 'Serge OUEDRAOGO',
      },
      where: {
        teamId_userId: {
          teamId: '3993ae8c-1c2d-405c-8231-a60a1587c091',
          userId: 'c2d36b2e-857e-44a9-8094-1e4c1549a36e',
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

run().then((e) => {
  console.warn(e);
});
