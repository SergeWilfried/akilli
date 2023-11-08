/* eslint-disable @typescript-eslint/no-var-requires */

const { PrismaClient } = require('@prisma/client');

async function run() {
  const prisma = new PrismaClient();
  // use `prisma` in your application to read and write data in your DB
  try {
    return await prisma.user.delete({
      where: {
        id: '5c3588aa-64e2-400e-9636-fea0792db3e7',
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
