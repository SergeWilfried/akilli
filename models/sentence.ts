import { prisma } from '@/lib/prisma';
import { sentences_detailed } from '@prisma/client';

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
    const newSentence = await prisma.sentences_detailed.create({
      data: {
        text,
        lang: languageCode,
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
  sentenceId: number,
  text: string,
  langCode: string
): Promise<sentences_detailed> {
  try {
    const updatedSentence = await prisma.sentences_detailed.update({
      where: { sentence_id: sentenceId, lang: langCode },
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
  sentenceId: number,
  langCode: string
): Promise<sentences_detailed> {
  try {
    const deletedSentence = await prisma.sentences_detailed.delete({
      where: { sentence_id: sentenceId, lang: langCode },
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
export async function getAllSentences(
  taskId: string | undefined,
  skip: number,
  limit: number,
  cursor: string,
  lang: string
) {
  try {
    const cursorObj =
      cursor === ''
        ? undefined
        : { sentence_id: parseInt(cursor as string, 10) };

    if (taskId) {
      const [sentences] = await prisma.$transaction([
        prisma.sentences_detailed.findMany({
          where: { taskId: taskId, lang: lang.toLocaleLowerCase() },
          take: limit,
          skip: cursor !== '' ? 1 : 0,
          cursor: cursorObj,
        }),
        prisma.sentences_detailed.count({
          where: { taskId: taskId, lang: lang.toLocaleLowerCase() },
        }),
      ]);

      return {
        nextId:
          sentences.length === limit
            ? sentences[limit - 1].sentence_id
            : undefined,
        sentences,
      };
    } else {
      const [sentences] = await prisma.$transaction([
        prisma.sentences_detailed.findMany({
          where: {
            lang: lang.toLocaleLowerCase(),
          },
          take: limit,
          skip: cursor !== '' ? 1 : 0,
          cursor: cursorObj,
        }),
        prisma.sentences_detailed.count({
          where: { lang: lang.toLocaleLowerCase() },
        }),
      ]);

      return {
        nextId:
          sentences.length === limit
            ? sentences[limit - 1].sentence_id
            : undefined,
        sentences,
      };
    }
  } catch (error) {
    console.error(error);
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
  sentenceId: number
): Promise<sentences_detailed> {
  try {
    const sentence = await prisma.sentences_detailed.findUnique({
      where: { sentence_id: sentenceId, taskId: taskId },
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
): Promise<sentences_detailed[]> {
  try {
    const sentences = await prisma.sentences_detailed.findMany({
      where: { lang: langCode },
      // include: { task: true },
      take: 20,
    });

    return sentences;
  } catch (error) {
    throw new Error('Failed to get sentences');
  }
}
