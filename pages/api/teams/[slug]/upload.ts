import { APIRoute, sanitizeKey } from 'next-s3-upload';

export default APIRoute.configure({
  key(req, filename) {
    const filetype = req.body?.filetype; // 123
    const lang = req.body?.lang; // 123
    const taskId = req.body?.taskId; // 123

    console.log(`lang`, lang);
    console.log(`taskId`, taskId);

    const date = new Date().toISOString();

    return `${lang}/${taskId}/${filetype}/${date}/${sanitizeKey(filename)}`;
  },
});
