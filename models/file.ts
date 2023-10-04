import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getFile(id: string) {
  return await prisma.file.findUnique({
    where: { id },
  });
}

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
  console.warn('file id', id);
  return await prisma.file.delete({
    where: { id },
  });
}
