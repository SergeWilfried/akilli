import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteFile } from '../../../../../../models/file';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'DELETE':
        await handleDELETE(req, res);
        break;

      default:
        res.setHeader('Allow', 'DELETE');
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

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fileId } = req.query as { fileId: string };
  console.warn(`fileId`, fileId);
  console.error(`req`, req.query);

  await deleteFile(fileId);

  res.status(200).json({ data: {} });
};
