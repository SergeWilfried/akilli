import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import env from '@/lib/env';

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: env.storage.accessKey
      ? env.storage.accessKey
      : '2u9Hv91cOIxyPpfgz537',
    secretAccessKey: env.storage.secretKey
      ? env.storage.secretKey
      : 'p5V98MGID2YtQdiYPqfDyx1hnXZ7S34RomYB44Fm',
  },
  endpoint: env.storage.publicEndpoint ?? 'http://localhost:9000',
  forcePathStyle: true,
});

export async function createFile(file: File) {
  try {
    // uploading object with string data on Body
    const objectKey = file?.name;
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    await s3.send(
      new PutObjectCommand({
        Bucket: env.storage.bucketName ?? 'akilli',
        Key: objectKey,
        Body: body,
      })
    );
    let fileUrl;
    if (!env.storage.bucketName) {
      fileUrl = `akilli/${objectKey}`;
    }
    console.log(`Successfully uploaded ${fileUrl}`);
    return fileUrl;
  } catch (err) {
    console.log('Error', err);
  }
}
