import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import env from '@/lib/env';

const s3 = new S3Client({
  region: env.storage.region,
  credentials: {
    accessKeyId: env.storage.accessKey ? env.storage.accessKey : '',
    secretAccessKey: env.storage.secretKey ? env.storage.secretKey : '',
  },
  endpoint: env.storage.publicEndpoint
    ? env.storage.publicEndpoint
    : 'http://localhost:9000',
  forcePathStyle: true,
});

export async function createFile(files: File[]) {
  try {
    const file = files[0] ? files[0] : undefined;
    const filesList = files.length > 0 ? files : undefined;
    let fileUrl: string = '';
    let urlList: string[];
    if (file) {
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

      if (!env.storage.bucketName) {
        fileUrl = `akilli/${objectKey}`;
      }
      console.log(`Successfully uploaded ${fileUrl}`);
    }
    if (filesList) {
      filesList.forEach(async (file) => {
        // uploading object with string data on Body
        const objectKey = file.name;
        const arrayBuffer = await file.arrayBuffer();
        const body = Buffer.from(arrayBuffer);
        await s3.send(
          new PutObjectCommand({
            Bucket: env.storage.bucketName ?? 'akilli',
            Key: objectKey,
            Body: body,
          })
        );

        if (!env.storage.bucketName) {
          fileUrl = `akilli/${objectKey}`;
          urlList.push(fileUrl);
        }
        console.log(`Successfully uploaded ${fileUrl}`);
      });
    }

    return fileUrl;
  } catch (err) {
    console.log('Error', err);
  }
}
