import { APIRoute, sanitizeKey } from 'next-s3-upload';
import * as dateFn from 'date-fns';
import mime from 'mime';
import env from 'lib/env';

export default APIRoute.configure({
  async key(req, filename) {
    const params = req.body; // 123
    console.log(params);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const formatedFileName = `${
      sanitizeKey(filename) || 'unknown'
    }-${uniqueSuffix}.${
      mime.getExtension(params?.mimetype || '') || 'unknown'
    }`;
    return `/uploads/${dateFn.format(
      Date.now(),
      'dd-MM-Y'
    )}/${formatedFileName}`;
  },
  endpoint: env.storage.publicEndpoint!,
  forcePathStyle: true,
  accessKeyId: env.storage.accessKey,
  secretAccessKey: env.storage.secretKey,
  region: env.storage.region,
  bucket: env.storage.bucketName!,
});
