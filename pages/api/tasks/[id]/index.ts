import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/session';
import { deleteTask, getOneTask, updateTask } from 'models/task';

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
      case 'PUT':
        await handlePUT(req, res);
        break;
      case 'DELETE':
        await handleDelete(req, res);
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

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };
  const session = await getSession(req, res);

  const tasks = await getOneTask({
    userId: session?.user.id as string,
    id: id,
  });
  res.status(200).json({ data: tasks });
};

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  // fix this
  const { id } = req.query as { id: string };
  const params = req.body;

  const lang = await updateTask(id, params);

  res.status(200).json({ data: lang });
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };

  const lang = await deleteTask({ id });
  res.status(200).json({ data: lang });
};
