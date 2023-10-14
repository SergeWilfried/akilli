import type { NextApiRequest, NextApiResponse } from 'next';
import { parseForm } from 'lib/parse-form';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      data: null,
      error: 'Method Not Allowed',
    });
    return;
  }
  // Just after the "Method Not Allowed" code
  try {
    const { fields, files } = await parseForm(req);

    const file = files?.media;
    console.warn('media', file);
    console.warn('fields', fields);

    const url = Array.isArray(file)
      ? file.map((f) => f.filepath)
      : file.filepath;
    res.status(200).json({
      data: {
        url,
      },
      error: null,
    });
  } catch (e: any) {
    console.error(e);
    res.status(e?.httpCode || 400).json({ data: null, error: e?.message });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
