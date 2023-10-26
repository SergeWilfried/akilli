import { prisma } from '@/lib/prisma';
import { Transcript } from '@prisma/client';

/**
 * Create a new transcript for a task
 * @param taskId - the id of the task to create a transcript for
 * @param text - the text of the transcript
 * @returns the created transcript
 */
export async function createTranscript(
  taskId: string,
  text: string,
  audioFileUrl: string
): Promise<Transcript> {
  try {
    const file = await prisma.file.findFirst({
      where: { url: audioFileUrl },
    });
    const newTranscript = await prisma.transcript.create({
      data: {
        text,
        task: {
          connect: {
            id: taskId,
          },
        },
        file: {
          connect: {
            id: file?.id,
          },
        },
      },
    });
    return newTranscript;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create transcript');
  }
}

/**
 * Update a transcript for a task
 * @param transcriptId - the id of the transcript to update
 * @param text - the updated text of the transcript
 * @returns the updated transcript
 */
export async function updateTranscript(
  transcriptId: string,
  text: string
): Promise<Transcript> {
  try {
    const updatedTranscript = await prisma.transcript.update({
      where: { id: transcriptId },
      data: { text },
      // include: { task: true },
    });

    return updatedTranscript;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update transcript');
  }
}

/**
 * Delete a transcript for a task
 * @param transcriptId - the id of the transcript to delete
 * @returns the deleted transcript
 */
export async function deleteTranscript(
  transcriptId: string
): Promise<Transcript> {
  try {
    const deletedTranscript = await prisma.transcript.delete({
      where: { id: transcriptId },
      // include: { task: true },
    });

    return deletedTranscript;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete transcript');
  }
}

/**
 * Get all transcripts for a specific task
 * @param taskId - the id of the task to get transcripts for
 * @returns all transcripts for the task
 */
export async function getAllTranscripts(
  taskId: string,
  skip: number,
  limit: number,
  cursor: string
): Promise<any> {
  try {
    const cursorObj = cursor === '' ? undefined : { id: cursor as string };
    const [transcripts] = await prisma.$transaction([
      prisma.transcript.findMany({
        where: { taskId: taskId },
        take: limit,
        skip: cursor !== '' ? 1 : 0,
        cursor: cursorObj,
      }),
      prisma.transcript.count({
        where: { taskId: taskId },
      }),
    ]);

    return {
      nextId:
        transcripts.length === limit ? transcripts[limit - 1].id : undefined,
      transcripts,
    };

    return transcripts;
  } catch (error) {
    throw new Error('Failed to get transcripts');
  }
}

/**
 * Get one transcript
 * @param taskId - the id of the task that the transcript belongs to
 * @param transcriptId - the id of the transcript to get
 * @returns the transcript
 */
export async function getTranscript(
  taskId: string,
  transcriptId: string
): Promise<Transcript> {
  try {
    const transcript = await prisma.transcript.findUnique({
      where: { id: transcriptId },
      // include: { task: true },
    });
    if (transcript) {
      return transcript;
    } else {
      throw new Error('no transcripts');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get transcript');
  }
}
