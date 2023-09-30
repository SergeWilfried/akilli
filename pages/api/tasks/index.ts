import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { createTask, getAllTasks } from 'models/task';
import { TaskWithFiles } from '../../../types';

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
  const tsc = req.body as TaskWithFiles;
  const session = await getSession(req, res);

  //FIXME
  const transcript = await createTask({
    ...tsc,
    status: tsc.status ? tsc.status : '',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: session?.user.id as string,
    files: tsc?.files,
  });
  res.status(200).json({ data: transcript });
};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);

  const tasks = await getAllTasks({
    userId: session?.user.id as string,
  });
  res.status(200).json({ data: tasks });
};
