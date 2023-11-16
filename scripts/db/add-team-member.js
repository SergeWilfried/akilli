/* eslint-disable @typescript-eslint/no-var-requires */

const { PrismaClient } = require('@prisma/client');

async function run() {
  const prisma = new PrismaClient();
  // use `prisma` in your application to read and write data in your DB
  try {
    return await prisma.transcriber.upsert({
      create: {
        teamId: 'cbfe7cc4-647c-4f68-a9c6-0f57d70e2c55',
        userId: '5955f7d3-5866-48d1-aba3-131a81cbafa7',
        role: 'ADMIN',
        email: 'info@bo.ai',
        name: 'Serge OUEDRAOGO',
      },
      where: {
        teamId_userId: {
          teamId: 'cbfe7cc4-647c-4f68-a9c6-0f57d70e2c55',
          userId: '5955f7d3-5866-48d1-aba3-131a81cbafa7',
        },
      },
      update: {
        email: 'info@bo.ai',
        name: 'Serge OUEDRAOGO',
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
