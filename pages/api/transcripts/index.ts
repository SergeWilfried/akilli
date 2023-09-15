import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { createTranscript, getTranscript } from 'models/transcript';
import { Task } from '../../../types';

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
      case 'POST':
        await handlePOST(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, POST');
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

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const tsc = req.body as Task;
  const session = await getSession(req, res);

  //FIXME
  const transcript = await createTranscript({
    ...tsc,
    assignedTranscriberId: tsc.assignedTranscriberId
      ? tsc.assignedTranscriberId
      : '',
    status: tsc.status ? tsc.status : '',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: session?.user.id as string,
    id: '',
  });
  res.status(200).json({ data: transcript });
};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);

  const transcripts = await getTranscript(session?.user.id as string);

  res.status(200).json({ data: transcripts });
};
