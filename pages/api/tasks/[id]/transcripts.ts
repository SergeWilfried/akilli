import { NextApiRequest, NextApiResponse } from 'next';
import {
  updateTranscript,
  createTranscript,
  deleteTranscript,
  getAllTranscripts,
} from '../../../../models/transcripts';
import { getFile } from '../../../../models/file';

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
  res.status(200).json({ data: transcripts });
};

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };
  const { text } = req.body as { text: string };

  await updateTranscript(id, text);

  res.status(200).json({ data: {} });
};

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };

  await deleteTranscript(id);

  res.status(200).json({ data: {} });
};

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };
  const { text, audioFileUrl, language } = req.body as {
    text: string;
    taskId: string;
    language: string;
    userId: string;
    audioFileUrl: string;
  };
  const file = await getFile({ url: audioFileUrl });
  if (file) {
    const transcript = await createTranscript(id, text, file?.id, language);
    res.status(200).json({ data: transcript });
  } else {
    res.status(400).json({ data: 'File not found' });
  }
};
