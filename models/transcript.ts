import { prisma } from '@/lib/prisma';
import { Task } from '../types';

export async function createTranscript(transcript: Task): Promise<Task> {
  try {
    return await prisma.task.create({
      data: {
        ...transcript,
        status: 'CREATED',
        deadline: new Date(),
      },
    });
  } catch (error) {
    throw new Error('Failed to create transcript');
  }
}

export async function getTranscript(id: string): Promise<Task | null> {
  try {
    return await prisma.task.findUnique({ where: { id } });
  } catch (error) {
    throw new Error('Failed to retrieve transcript');
  }
}

export async function updateTranscript(transcript: Task): Promise<Task | null> {
  try {
    const { id, ...data } = transcript;
    return await prisma.task.update({ where: { id }, data });
  } catch (error) {
    throw new Error('Failed to update transcript');
  }
}

export async function deleteTranscript(id: string): Promise<void> {
  try {
    await prisma.task.delete({ where: { id } });
  } catch (error) {
    throw new Error('Failed to delete transcript');
  }
}
