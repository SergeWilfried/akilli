import { Transcript } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function createTranscript(
  transcript: Transcript
): Promise<Transcript> {
  try {
    return await prisma.transcript.create({ data: transcript });
  } catch (error) {
    // Handle the error
    throw new Error('Failed to create transcript');
  }
}

export async function getTranscript(id: string): Promise<Transcript | null> {
  try {
    return await prisma.transcript.findUnique({ where: { id } });
  } catch (error) {
    // Handle the error
    throw new Error('Failed to retrieve transcript');
  }
}

export async function updateTranscript(
  transcript: Transcript
): Promise<Transcript | null> {
  try {
    const { id, ...data } = transcript;
    return await prisma.transcript.update({ where: { id }, data });
  } catch (error) {
    // Handle the error
    throw new Error('Failed to update transcript');
  }
}

export async function deleteTranscript(id: string): Promise<void> {
  try {
    await prisma.transcript.delete({ where: { id } });
  } catch (error) {
    // Handle the error
    throw new Error('Failed to delete transcript');
  }
}
