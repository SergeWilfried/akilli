import { hashPassword } from '@/lib/auth';
import { generateToken } from '@/lib/common';
import { sendVerificationEmail } from '@/lib/email/sendVerificationEmail';
import { prisma } from '@/lib/prisma';
import { isBusinessEmail } from '@/lib/email/utils';
import env from '@/lib/env';
import { ApiError } from '@/lib/errors';
import { createUser, getUser, updateUser } from 'models/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        await handlePOST(req, res);
        break;
      case 'PUT':
        await handlePUT(req, res);
        break;
      default:
        res.setHeader('Allow', 'POST');
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

// Signup the user
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password, mobileNumber, country } = req.body;

  const existingUser = await getUser({ email });

  if (existingUser) {
    throw new ApiError(400, 'An user with this email already exists.');
  }

  if (env.disableNonBusinessEmailSignup && !isBusinessEmail(email)) {
    throw new ApiError(
      400,
      `We currently only accept work email addresses for sign-up. Please use your work email to create an account. If you don't have a work email, feel free to contact our support team for assistance.`
    );
  }

  const user = await createUser({
    name,
    email,
    password: await hashPassword(password),
    mobile: mobileNumber ? mobileNumber : '',
    country: country ? country : '',
  });

  // Send account verification email
  if (env.confirmEmail) {
    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: generateToken(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      },
    });

    await sendVerificationEmail({ user, verificationToken });
  }

  res.status(201).json({
    data: {
      user,
      confirmEmail: env.confirmEmail,
    },
  });
};

// Update the user
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, name, email, mobileNumber, country } = req.body;

  const existingUser = await getUser({ id });

  if (!existingUser) {
    throw new ApiError(400, 'No user found with this id.');
  }

  const updatedUser = await updateUser({
    id,
    name,
    email,
    mobileNumber: mobileNumber ? mobileNumber : '',
    country: country ? country : '',
  });

  res.status(200).json({
    data: {
      updatedUser,
    },
  });
};
