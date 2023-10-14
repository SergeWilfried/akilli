import type { NextApiRequest } from 'next';
import mime from 'mime';
import { join } from 'path';
import * as dateFn from 'date-fns';
import formidable from 'formidable';
import { stat } from 'fs/promises';
import env from './env';
import { PassThrough } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import { s3 } from './storage/minio';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';

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
        // await createFolderIfNotExist(env.storage.bucketName!, uploadDir);
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }
    const s3Uploads: Promise<any>[] = [];
    /** @param {import('formidable').File} file */
    function fileWriteStreamHandler(file) {
      const body = new PassThrough();
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: ROOT_DIR,
          Key: `${file.mimetype}/${file.originalFilename}`,
          ContentType: file.mimetype,
          ACL: 'public-read',
          Body: body,
        },
      });
      const uploadRequest = upload
        .done()
        .then((response: CompleteMultipartUploadCommandOutput) => {
          file.location = response.Location;
        });
      s3Uploads?.push(uploadRequest);
      return body;
    }

    let filename = ''; //  To avoid duplicate upload
    const form = formidable({
      maxFiles: 10,
      multiples: true,
      fileWriteStreamHandler: fileWriteStreamHandler,
      maxFileSize: 100 * 1024 * 1024, //100 MBs converted to bytes,
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
      else {
        Promise.all(s3Uploads)
          .then(() => {
            resolve({ fields, files });
          })
          .catch(reject);
      }
    });

    form.on('error', (error) => {
      reject(error.message);
    });
  });
};
