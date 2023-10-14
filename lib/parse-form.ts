import type { NextApiRequest } from 'next';
import mime from 'mime';
import { join } from 'path';
import * as dateFn from 'date-fns';
import formidable from 'formidable';
import { stat } from 'fs/promises';
import { createFolderIfNotExist } from './storage/minio';
import env from './env';

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  // eslint-disable-next-line no-async-promise-executor
  return await new Promise(async (resolve, reject) => {
    const ROOT_DIR = env.storage.bucketName!;
    const uploadDir = join(
      ROOT_DIR || process.cwd(),
      `/uploads/${dateFn.format(Date.now(), 'dd-MM-Y')}`
    );

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        await createFolderIfNotExist(env.storage.bucketName, uploadDir);
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }

    let filename = ''; //  To avoid duplicate upload
    const form = formidable({
      maxFiles: 5,
      maxFileSize: 1024 * 1024, // 1mb
      uploadDir,
      filename: (_name, _ext, part) => {
        if (filename !== '') {
          return filename;
        }

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        filename = `${part.name || 'unknown'}-${uniqueSuffix}.${
          mime.getExtension(part.mimetype || '') || 'unknown'
        }`;
        return filename;
      },
      filter: (part) => {
        return (
          part.name === 'media' && (part.mimetype?.includes('audio') || false)
        );
      },
    });

    form.parse(req, function (err, fields, files) {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
