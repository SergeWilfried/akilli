import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllSentences } from '../../../../models/sentence';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        await handleGET(req, res);
        break;

      default:
        res.setHeader('Allow', 'GET');
        res.status(405).json({
          error: { message: `Method ${method} Not Allowed` },
        });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;
    res.status(status).json({ error: { message } });
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { skip, limit, cursor, lang } = req.query as {
    id: any;
    skip: string;
    limit: string;
    cursor: string;
    lang: string;
  };
  const transcripts = await getAllSentences(
    undefined,
    Number(skip),
    Number(limit),
    cursor,
    lang
  );

  res.status(200).json({
    data: transcripts,
  });
};
