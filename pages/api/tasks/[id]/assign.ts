import type { NextApiRequest, NextApiResponse } from 'next';
import { sendTeamInviteEmail } from '@/lib/email/sendTeamInviteEmail';
import { ApiError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { throwIfNoTeamAccess } from 'models/team';
import { throwIfNotAllowed } from 'models/user';
import { createInvitation } from 'models/invitation';
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

      default:
        res.setHeader('Allow', 'GET, POST, PUT, DELETE');
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

// Invite a user to a team
const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, role, taskId } = req.body;
  const teamMember = await throwIfNoTeamAccess(req, res);
  throwIfNotAllowed(teamMember, 'team_invitation', 'create');

  const invitationExists = await prisma.invitation.findFirst({
    where: {
      email,
      taskId,
    },
  });

  if (invitationExists) {
    throw new ApiError(400, 'An invitation already exists for this email.');
  }

  const invitation = await createInvitation({
    teamId: teamMember.teamId,
    invitedBy: teamMember.userId,
    email,
    role,
    taskId,
  });

  await sendTeamInviteEmail(teamMember.team, invitation, taskId);

  res.status(200).json({ data: invitation });
};
