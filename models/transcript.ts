import { prisma } from '@/lib/prisma';
import { Task } from '@prisma/client';

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
    console.error(error);
    throw new Error('Failed to create transcript');
  }
}
export async function addFilesToTask(
  taskId: string,
  files: File[]
): Promise<Task> {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new Error('Task not found');
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        files: {
          createMany: {
            data: files.map((file) => ({
              name: file.name,
              url: '',
              type: file.type,
              contentSize: file.size,
              fileFormat: file.type,
            })),
          },
        },
      },
    });

    return updatedTask;
  } catch (error) {
    throw new Error('Failed to add files to task');
  }
}

export async function getAllTranscripts(key: { userId: string }): Promise<any> {
  try {
    return await prisma.task.findMany({ where: key });
  } catch (error) {
    throw new Error('Failed to retrieve transcript');
  }
}

export async function getOneTranscript(key: {
  userId: string;
  id: string;
}): Promise<any> {
  try {
    return await prisma.task.findMany({ where: key });
  } catch (error) {
    throw new Error('Failed to retrieve transcript');
  }
}

export async function updateTranscript(
  id: string,
  data: Partial<Task>
): Promise<Task | null> {
  try {
    return await prisma.task.update({ where: { id }, data });
  } catch (error) {
    throw new Error('Failed to update transcript');
  }
}

export async function deleteTranscript(key: { id: string }): Promise<void> {
  try {
    await prisma.task.delete({ where: key });
  } catch (error) {
    throw new Error('Failed to delete transcript');
  }
}
