import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllTranscripts } from '../../../../models/transcripts';

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
  const { skip, limit, cursor, taskId } = req.query as {
    id: any;
    skip: string;
    limit: string;
    cursor: string;
    taskId: string;
  };
  const transcripts = await getAllTranscripts(
    taskId,
    Number(skip),
    Number(limit),
    cursor
  );

  res.status(200).json({
    data: transcripts,
  });
};
