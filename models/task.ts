import { prisma } from '@/lib/prisma';
import { Task, Transcriber } from '@prisma/client';
import { TaskWithFiles } from '../types';

type PutBlobResult = {
  url: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
};

export async function createTask(
  transcript: TaskWithFiles
): Promise<TaskWithFiles> {
  try {
    return await prisma.task.create({
      data: {
        ...transcript,
        status: 'CREATED',
        deadline: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
        files: {
          create: [...transcript.files],
        },
      },
      include: {
        files: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create transcript');
  }
}
export async function addFilesToTask(
  taskId: string,
  files: PutBlobResult[]
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
              url: file?.url,
              fileFormat: file.contentType,
              pathname: file.pathname,
              contentDisposition: file.contentDisposition,
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

export async function getAllTasks(key: { userId: string }): Promise<any> {
  try {
    return await prisma.task.findMany({ where: key });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve task');
  }
}

export async function getOneTask(key: {
  userId: string;
  id: string;
}): Promise<any> {
  try {
    return await prisma.task.findMany({ where: key, include: { files: true } });
  } catch (error) {
    throw new Error('Failed to retrieve task');
  }
}

export async function updateTask(
  id: string,
  data: Partial<Task>
): Promise<Task | null> {
  try {
    return await prisma.task.update({ where: { id }, data });
  } catch (error) {
    throw new Error('Failed to update task');
  }
}

export async function deleteTask(key: { id: string }): Promise<void> {
  try {
    await prisma.task.delete({ where: key });
  } catch (error) {
    throw new Error('Failed to delete task');
  }
}

/**
 * Assigns a transcriber to a task
 * @param taskId - the id of the task to assign a transcriber to
 * @param transcriberId - the id of the transcriber to assign to the task
 * @returns the updated task
 */
export async function assignTranscriberToTask(
  taskId: string,
  transcriberId: string
): Promise<Task> {
  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        transcribers: {
          connect: { id: transcriberId },
        },
      },
      include: { files: true, transcribers: true },
    });

    return updatedTask;
  } catch (error) {
    throw new Error('Failed to assign transcriber to task');
  }
}

/**
 * Removes a transcriber from a task
 * @param taskId - the id of the task to remove a transcriber from
 * @param transcriberId - the id of the transcriber to remove from the task
 * @returns the updated task
 */
export async function removeTranscriberFromTask(
  taskId: string,
  transcriberId: string
): Promise<Task> {
  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        transcribers: {
          disconnect: { id: transcriberId },
        },
      },
      include: { files: true, transcribers: true },
    });

    return updatedTask;
  } catch (error) {
    throw new Error('Failed to remove transcriber from task');
  }
}

/**
 * Get all transcribers assigned to a task
 * @param taskId - the id of the task to get transcribers for
 * @returns the list of transcribers assigned to the task
 */
export async function getAssignedTranscribers(
  taskId: string
): Promise<Transcriber[]> {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { transcribers: true },
    });

    if (task) {
      return task.transcribers;
    } else {
      throw new Error('Task not found');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get transcribers for the selected task');
  }
}
