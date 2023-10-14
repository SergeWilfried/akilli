import { FetchHttpHandler } from '@smithy/fetch-http-handler';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import env from '@/lib/env';

export const s3 = new S3Client({
  region: env.storage.region ? env.storage.region : 'us-east-1',
  requestHandler: new FetchHttpHandler({ keepAlive: false }),
  credentials: {
    accessKeyId: env.storage.accessKey
      ? env.storage.accessKey
      : 'KCX75RVNhVpk7qp50wtK',
    secretAccessKey: env.storage.secretKey
      ? env.storage.secretKey
      : 'CFiINitd069FJDyFpkDxNG7XUdynWF5lIYIWyHhj',
  },
  endpoint: env.storage.publicEndpoint
    ? env.storage.publicEndpoint
    : 'http://localhost:9000',
  forcePathStyle: true,
});

export async function createFile(file: File) {
  let fileUrl = ``;
  try {
    if (file) {
      // uploading object with string data on Body
      const objectKey = file?.name;
      const bucketName = `akilli`;
      const arrayBuffer = await file.arrayBuffer();
      const body = Buffer.from(arrayBuffer);
      await s3.send(
        new PutObjectCommand({
          Bucket: env.storage.bucketName ?? 'akilli',
          Key: objectKey,
          Body: body,
        })
      );

      fileUrl = `${bucketName}/${objectKey}`;

      console.log(`Successfully uploaded files ${fileUrl}`);
    }
    return fileUrl;
  } catch (err: any) {
    console.error('Error', err);
    throw Error(err?.message);
  }
}

// Specifies a path within your bucket and the file to download.
interface bucketParams {
  Bucket: string;
  Key: string;
}

export async function getMediaURL(params: bucketParams) {
  try {
    const url = await getSignedUrl(s3, new GetObjectCommand(params), {
      expiresIn: 15 * 60,
    }); // Adjustable expiration.
    console.log('url:', url);
    return url;
  } catch (err: any) {
    console.log('error', err);
    throw Error(err?.message);
  }
}

async function createFolder(Bucket, Key) {
  const command = new PutObjectCommand({ Bucket, Key });
  return s3.send(command);
}

async function existsFolder(Bucket, Key) {
  const command = new HeadObjectCommand({ Bucket, Key });

  try {
    await s3.send(command);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound') {
      return false;
    } else {
      throw error;
    }
  }
}

export async function createFolderIfNotExist(Bucket: string, Key: string) {
  try {
    if (!(await existsFolder(Bucket, Key))) {
      await createFolder(Bucket, Key);
    }
  } catch (err: any) {
    console.error('Error', err);
    throw Error(err?.message);
  }
}

export async function deleteFolder(Bucket, Key) {
  const command = new DeleteObjectCommand({ Bucket, Key });
  return s3.send(command);
}
