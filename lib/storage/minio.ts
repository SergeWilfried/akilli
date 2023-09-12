import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import env from '../env';

const s3 = new S3Client({
  credentials: {
    accessKeyId: env.storage.accessKey ? env.storage.accessKey : '',
    secretAccessKey: env.storage.secretKey ? env.storage.secretKey : '',
  },
  endpoint: env.storage.publicEndpoint,
  forcePathStyle: true,
});

export async function createFile(objectKey: string, body: Buffer) {
  try {
    // uploading object with string data on Body
    await s3.send(
      new PutObjectCommand({
        Bucket: env.storage.bucketName,
        Key: objectKey,
        Body: body,
      })
    );

    console.log(`Successfully uploaded ${env.storage.bucketName}/${objectKey}`);
  } catch (err) {
    console.log('Error', err);
  }
}
