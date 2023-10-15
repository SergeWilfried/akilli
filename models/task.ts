import { prisma } from '@/lib/prisma';
import { Task, Transcriber } from '@prisma/client';

export async function createTask(transcript: any) {
  try {
    console.log(transcript);
    return await prisma.task.create({
      data: {
        name: transcript.name,
        language: transcript.language,
        type: transcript.type,
        status: 'CREATED',
        deadline: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
        user: {
          connect: {
            id: transcript?.userId,
          },
        },
        files: {},
        team: {
          connect: {
            id: transcript.teamId,
          },
        },
      },

      include: {
        files: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create new task');
  }
}
export async function addFilesToTask(taskId: string, files: []): Promise<Task> {
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
            data: files.map((file: any) => ({
              url: file?.url,
              fileFormat: file.type,
              contentSize: file.size,
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

export async function getAllTasks(): Promise<any> {
  try {
    const team = await prisma.team.findFirst({
      where: {
        slug: 'akilli',
      },
      include: {
        tasks: true,
      },
    });
    return team?.tasks;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve tasks');
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

    console.warn('transcribers', task?.transcribers);

    if (task) {
      return task?.transcribers;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get transcribers for the selected task');
  }
}
