import { ApiError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { sendAudit } from '@/lib/retraced';
import { sendEvent } from '@/lib/svix';
import { Role } from '@prisma/client';
import { removeTranscriberFromTask } from 'models/task';
import { throwIfNotAllowed } from 'models/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTeamMembers, throwIfNoTeamAccess } from '../../../../models/team';

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
      case 'DELETE':
        await handleDELETE(req, res);
        break;
      case 'PUT':
        await handlePUT(req, res);
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

// Get members of a team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };

  const members = await getTeamMembers('Akilli');
  console.warn('members', id);
  res.status(200).json({ data: members });
};

// Delete the member from the team
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const teamMember = await throwIfNoTeamAccess(req, res);
  throwIfNotAllowed(teamMember, 'team_member', 'delete');

  const { id } = req.query as { id: string };

  const teamMemberRemoved = await removeTranscriberFromTask(
    teamMember.teamId,
    id
  );

  await sendEvent(teamMember.teamId, 'member.removed', teamMemberRemoved);

  sendAudit({
    action: 'member.remove',
    crud: 'd',
    user: teamMember.user,
    team: teamMember.team,
  });

  res.status(200).json({ data: {} });
};

// Leave a team
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const teamMember = await throwIfNoTeamAccess(req, res);
  throwIfNotAllowed(teamMember, 'team', 'leave');

  const totalTeamOwners = await prisma.transcriber.count({
    where: {
      role: Role.OWNER,
      teamId: teamMember.teamId,
    },
  });

  if (totalTeamOwners <= 1) {
    throw new ApiError(400, 'A team should have at least one owner.');
  }

  await removeTranscriberFromTask(teamMember.teamId, teamMember.user.id);

  res.status(200).json({ data: {} });
};
