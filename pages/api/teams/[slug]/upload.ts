import { APIRoute, sanitizeKey } from 'next-s3-upload';

export default APIRoute.configure({
  key(req, filename) {
    const lang = req.body?.lang; // 123
    const taskId = req.body?.taskId; // 123

    const date = new Date().toISOString();

    return `${lang}/audio/${taskId}/${date}/${sanitizeKey(filename)}`;
  },
});
