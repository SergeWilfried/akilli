import { NextApiRequest, NextApiResponse } from 'next';
import { createLanguage, getAllLanguages } from '../../../models/language';

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
  const { name, description, code } = req.body;

  const lang = await createLanguage({ name, description, code });
  res.status(200).json({ data: lang });
};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const languages = await getAllLanguages();
  res.status(200).json({ data: languages });
};
