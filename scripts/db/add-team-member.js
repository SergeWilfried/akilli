/* eslint-disable @typescript-eslint/no-var-requires */

const { PrismaClient } = require('@prisma/client');

async function run() {
  const prisma = new PrismaClient();
  // use `prisma` in your application to read and write data in your DB
  try {
    return await prisma.transcriber.upsert({
      create: {
        teamId: 'e9f45b46-20bd-4ccd-ba24-c81067ceadd8',
        userId: '15504df9-5220-44aa-805d-cccff2e0d773',
        role: 'ADMIN',
        email: 'info@bo.ai',
        name: 'Serge OUEDRAOGO',
      },
      where: {
        teamId_userId: {
          teamId: 'e9f45b46-20bd-4ccd-ba24-c81067ceadd8',
          userId: '15504df9-5220-44aa-805d-cccff2e0d773',
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
