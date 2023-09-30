import { NextApiRequest, NextApiResponse } from 'next';
import {
  getTranscript,
  updateTranscript,
  createTranscript,
  deleteTranscript,
} from '../../../../models/transcripts';

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
  const { id } = req.query as { id: string };
  const transcripts = await getTranscript(id);

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
  const { text } = req.body as { text: string };

  const transcript = await createTranscript(id, text);

  res.status(200).json({ data: transcript });
};
