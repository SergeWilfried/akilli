import { prisma } from '@/lib/prisma';

export const createLanguage = async (param: {
  name: string;
  description: string;
}) => {
  const { name, description } = param;
  return await prisma.language.create({
    data: {
      description: description,
      name: name,
    },
  });
};

export const getLanguage = async (key: { id: string } | { name: string }) => {
  return await prisma.language.findUniqueOrThrow({
    where: key,
  });
};

export const getAllLanguages = async () => {
  return await prisma.language.findMany({});
};

export const deleteLanguage = async (
  key: { id: string } | { name: string }
) => {
  return await prisma.language.delete({
    where: key,
  });
};

export const updateLanguage = async (
  key: { id: string } | { name: string },
  params: { name: string; description: string }
) => {
  return await prisma.language.update({
    where: key,
    data: params,
  });
};
