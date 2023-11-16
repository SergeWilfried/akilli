import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFile = async (key: { id: string } | { url: string }) => {
  return await prisma.file.findUnique({
    where: key,
  });
};

export async function updateFile(
  id: string,
  data: {
    url?: string;
    contentSize?: number;
    fileFormat?: string;
  }
) {
  return await prisma.file.update({
    where: { id },
    data,
  });
}

export async function deleteFile(id: string) {
  return await prisma.file.delete({
    where: { id },
  });
}
