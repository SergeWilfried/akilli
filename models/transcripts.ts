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
  text: string
): Promise<Transcript> {
  try {
    const newTranscript = await prisma.transcript.create({
      data: {
        text: text,
        task: {
          connect: { id: taskId },
        },
      },
      include: { task: true },
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
      include: { task: true },
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
      include: { task: true },
    });

    return deletedTranscript;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete transcript');
  }
}

/**
 * Get all transcripts
 * @returns all transcripts
 */
export async function getAllTranscripts(): Promise<Transcript[]> {
  try {
    const transcripts = await prisma.transcript.findMany({
      include: { task: true },
    });

    return transcripts;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get transcripts');
  }
}

/**
 * Get one transcript
 * @param transcriptId - the id of the transcript to get
 * @returns the transcript
 */
export async function getTranscript(transcriptId: string): Promise<Transcript> {
  try {
    const transcript = await prisma.transcript.findUnique({
      where: { id: transcriptId },
      include: { task: true },
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