import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteLanguage,
  getLanguage,
  updateLanguage,
} from '../../../../models/language';

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
        res.setHeader('Allow', 'GET, PUT, DELETE');
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
  const { name } = req.query as { name: string };

  const lang = await getLanguage({ name });
  res.status(200).json({ data: lang });
};

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  // fix this
  const { name } = req.query as { name: string };
  const params = req.body;

  const lang = await updateLanguage({ id: name }, params);

  res.status(200).json({ data: lang });
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query as { name: string };

  const lang = await deleteLanguage({ name });
  res.status(200).json({ data: lang });
};
