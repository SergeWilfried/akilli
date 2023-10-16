import { prisma } from '@/lib/prisma';
import { Sentence } from '@prisma/client';

/**
 * Create a new sentence for a task
 * @param taskId - the id of the task to create a sentence for
 * @param text - the text of the sentence
 * @returns the created sentence
 */
export async function createSentence(
  taskId: string,
  text: string,
  languageCode: string
): Promise<any> {
  try {
    const newSentence = await prisma.sentence.create({
      data: {
        text,
        language: {
          connect: {
            code: languageCode,
          },
        },
        task: {
          connect: {
            id: taskId,
          },
        },
      },
    });
    return newSentence;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create sentence');
  }
}

/**
 * Update a sentence for a task
 * @param sentenceId - the id of the sentence to update
 * @param text - the updated text of the sentence
 * @returns the updated sentence
 */
export async function updateSentence(
  sentenceId: string,
  text: string,
  langCode: string
): Promise<Sentence> {
  try {
    const updatedSentence = await prisma.sentence.update({
      where: { id: sentenceId, langCode },
      data: { text },
      // include: { task: true },
    });

    return updatedSentence;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update sentence');
  }
}

/**
 * Delete a sentence for a task
 * @param sentenceId - the id of the sentence to delete
 * @returns the deleted sentence
 */
export async function deleteSentence(
  sentenceId: string,
  langCode: string
): Promise<Sentence> {
  try {
    const deletedSentence = await prisma.sentence.delete({
      where: { id: sentenceId, langCode },
      // include: { task: true },
    });

    return deletedSentence;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete sentence');
  }
}

/**
 * Get all sentences for a specific task
 * @param taskId - the id of the task to get sentences for
 * @returns all sentences for the task
 */
export async function getAllSentences(taskId: string): Promise<Sentence[]> {
  try {
    const sentences = await prisma.sentence.findMany({
      where: { id: taskId },
      // include: { task: true },
    });

    return sentences;
  } catch (error) {
    throw new Error('Failed to get sentences');
  }
}

/**
 * Get one sentence
 * @param taskId - the id of the task that the sentence belongs to
 * @param sentenceId - the id of the sentence to get
 * @returns the sentence
 */
export async function getSentence(
  taskId: string,
  sentenceId: string
): Promise<Sentence> {
  try {
    const sentence = await prisma.sentence.findUnique({
      where: { id: sentenceId },
      // include: { task: true },
    });
    if (sentence) {
      return sentence;
    } else {
      throw new Error('no sentences');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get sentence');
  }
}

/**
 * Get all sentences for a specific task
 * @param taskId - the id of the task to get sentences for
 * @returns all sentences for the task
 */
export async function getSentencesByLang(
  langCode: string
): Promise<Sentence[]> {
  try {
    const sentences = await prisma.sentence.findMany({
      where: { langCode: langCode },
      // include: { task: true },
      take: 20,
    });

    return sentences;
  } catch (error) {
    throw new Error('Failed to get sentences');
  }
}
