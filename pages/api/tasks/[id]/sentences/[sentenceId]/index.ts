import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteSentence,
  updateSentence,
} from '../../../../../../models/sentence';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'PUT':
        await handlePUT(req, res);
        break;
      case 'DELETE':
        await handleDELETE(req, res);
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
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sentenceId } = req.query as { sentenceId: string };
  const { taskId, text } = req.body as { taskId: string; text: string };

  await updateSentence(sentenceId, text, taskId);
  res.status(200).json({ data: {} });
};

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sentenceId } = req.query as { sentenceId: string };
  await deleteSentence(sentenceId);

  res.status(200).json({ data: {} });
};
