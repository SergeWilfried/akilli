import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import env from '@/lib/env';

const s3 = new S3Client({
  region: env.storage.region ? env.storage.region : 'us-east-1',
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
    console.log('Error', err);
    throw Error(err?.message);
  }
}
