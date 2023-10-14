import { APIRoute } from 'next-s3-upload';
import env from 'lib/env';

export default APIRoute.configure({
  async key(req, filename) {
    const params = req.body; // 123
    console.log(params);
    return filename;
  },
  endpoint: env.storage.publicEndpoint!,
  forcePathStyle: true,
  accessKeyId: env.storage.accessKey,
  secretAccessKey: env.storage.secretKey,
  region: env.storage.region,
  bucket: env.storage.bucketName!,
});
