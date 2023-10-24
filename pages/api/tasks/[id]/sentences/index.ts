import { NextApiRequest, NextApiResponse } from 'next';
import {
  createTranscript,
  deleteTranscript,
} from '../../../../../models/transcripts';
import {
  getAllSentences,
  updateSentence,
} from '../../../../../models/sentence';

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
      case 'DELETE':
        await handleDELETE(req, res);
        break;
      case 'PUT':
        await handlePUT(req, res);
        break;
      case 'POST':
        await handlePOST(req, res);
        break;

      default:
        res.setHeader('Allow', 'GET, DELETE, PUT, PATCH');
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
  const { id, skip, limit, cursor, lang } = req.query as {
    id: any;
    skip: string;
    limit: string;
    cursor: string;
    lang: string;
  };
  const transcripts = await getAllSentences(
    id,
    Number(skip),
    Number(limit),
    cursor,
    lang
  );

  res.status(200).json({
    data: transcripts,
  });
};

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };
  const { taskId, text } = req.body as { taskId: string; text: string };

  await updateSentence(Number(id), text, taskId);
  res.status(200).json({ data: {} });
};

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };

  await deleteTranscript(id);

  res.status(200).json({ data: {} });
};

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };
  const { text } = req.body as { text: string };

  const transcript = await createTranscript(id, text);

  res.status(200).json({ data: transcript });
};
