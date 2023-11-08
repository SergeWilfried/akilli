/* eslint-disable @typescript-eslint/no-var-requires */

const { PrismaClient } = require('@prisma/client');

async function run() {
  const prisma = new PrismaClient();
  // use `prisma` in your application to read and write data in your DB
  await prisma.team.create({
    data: {
      slug: 'akilli',
      name: 'Akilli',
    },
  });
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
  try {
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
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

run().then((e) => {
  console.warn(e);
});
