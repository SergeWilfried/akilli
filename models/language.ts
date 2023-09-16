import { prisma } from '@/lib/prisma';

export const createLanguage = async (param: {
  name: string;
  description: string;
  code: string;
}) => {
  const { name, description, code } = param;
  console.log(code);
  return await prisma.language.create({
    data: {
      description: description,
      name: name,
      code: name.slice(0, 2),
    },
  });
};

export const getLanguage = async (
  key: { id: string } | { code: string } | { name: string }
) => {
  return await prisma.language.findUniqueOrThrow({
    where: key,
  });
};

export const getAllLanguages = async () => {
  return await prisma.language.findMany({});
};

export const deleteLanguage = async (
  key: { id: string } | { code: string } | { name: string }
) => {
  return await prisma.language.delete({
    where: key,
  });
};

export const updateLanguage = async (
  key: { id: string } | { code: string } | { name: string },
  params: { name: string; description: string }
) => {
  return await prisma.language.update({
    where: key,
    data: params,
  });
};
