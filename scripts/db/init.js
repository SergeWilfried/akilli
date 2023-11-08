/* eslint-disable @typescript-eslint/no-var-requires */

const { PrismaClient } = require('@prisma/client');

const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

async function run() {
  const prisma = new PrismaClient();
  // use `prisma` in your application to read and write data in your DB
  console.log(`Create admin account`);

  try {
    const user = await prisma.user.create({
      data: {
        email: 'info@akilli.ai',
        password: await hashPassword('Default123@'),
        mobileNumber: '0022556525141',
        country: 'Benin',
        role: 'ADMIN',
        name: 'Manager',
      },
    });
    console.log(`new admin created`, user);
    console.log(`Init Create default team`);

    const team = await prisma.team.create({
      data: {
        slug: 'akilli',
        name: 'Akilli',
      },
    });
    console.log(`default team created`, user);
    console.log(`Start Set admin as team manager`);

    const teamMember = await prisma.transcriber.upsert({
      create: {
        teamId: team.id ? team.id : '',
        userId: user.id ? user.id : '',
        role: 'ADMIN',
        email: 'info@akilli.ai',
        name: user?.name,
      },
      where: {
        teamId_userId: {
          teamId: team.id ? team.id : '',
          userId: user.id ? user.id : '',
        },
      },
      update: {
        role: 'ADMIN',
        email: 'info@akilli.ai',
        name: user?.name,
      },
    });
    console.log(`Done`, teamMember);
    console.log(`Add default langs`);

    const langs = [
      {
        name: 'French',
        description: 'France',
        code: 'fra',
      },
      {
        name: 'English',
        description: 'US English',
        code: 'eng',
      },
    ];
    const results = [];
    langs.forEach(async (e) => {
      const langs = await prisma.language.create({
        data: {
          code: e.code,
          name: e.name,
          description: e.description,
        },
      });
      results.push(langs);
      return langs;
    });
    results;
    console.log(`Default langs added`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

run().then((e) => {
  console.warn(e);
});
