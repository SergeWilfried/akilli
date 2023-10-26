import type { NextApiRequest, NextApiResponse } from 'next';
import { getFile } from 'models/file';
import { addFilesToTask } from 'models/task';

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
      case 'PUT':
        await handlePUT(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, POST, PUT');
        res.status(405).json({
          error: { message: `Method ${method} Not Allowed` },
        });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;
    console.error(error);
    res.status(status).json({ error: { message } });
  }
}

// Create an API key
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { taskId, files } = req.body;

  const updatedFilesList = await addFilesToTask(taskId, files);
  res.status(200).json({ data: updatedFilesList });
};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = JSON.parse(req.body) as { id: string };
  const file = getFile(id);
  res.status(200).json({ data: file });
};

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  // with Promise

  res.status(400).json('No file uploaded');
};
