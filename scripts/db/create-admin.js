/* eslint-disable @typescript-eslint/no-var-requires */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

async function run() {
  const prisma = new PrismaClient();
  // use `prisma` in your application to read and write data in your DB
  try {
    return await prisma.user.create({
      data: {
        email: 'info@akilli.ai',
        password: await hashPassword('Default123@'),
        mobileNumber: '0022556525141',
        country: 'Benin',
        role: 'ADMIN',
        name: 'Manager',
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
