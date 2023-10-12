import { sendTeamInviteEmail } from '@/lib/email/sendTeamInviteEmail';
import { ApiError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { sendAudit } from '@/lib/retraced';
import { getSession } from '@/lib/session';
import { sendEvent } from '@/lib/svix';
import {
  createInvitation,
  deleteInvitation,
  deleteTaskInvitation,
  getInvitation,
  getInvitations,
} from 'models/invitation';
import { addTeamMember, throwIfNoTeamAccess } from 'models/team';
import { throwIfNotAllowed } from 'models/user';
import type { NextApiRequest, NextApiResponse } from 'next';

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
      case 'DELETE':
        await handleDELETE(req, res);
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
  const teamMember = await throwIfNoTeamAccess(req, res);
  throwIfNotAllowed(teamMember, 'team_invitation', 'create');

  const { email, role, taskId } = req.body;

  const invitationExists = await prisma.invitation.findFirst({
    where: {
      email,
      teamId: teamMember.teamId,
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

  await sendEvent(teamMember.teamId, 'invitation.created', invitation);

  await sendTeamInviteEmail(teamMember.team, invitation);

  sendAudit({
    action: 'member.invitation.create',
    crud: 'c',
    user: teamMember.user,
    team: teamMember.team,
  });

  res.status(200).json({ data: invitation });
};

// Get all invitations for a team
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const teamMember = await throwIfNoTeamAccess(req, res);
  throwIfNotAllowed(teamMember, 'team_invitation', 'read');

  const invitations = await getInvitations(teamMember.teamId);

  res.status(200).json({ data: invitations });
};

// Delete an invitation
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const teamMember = await throwIfNoTeamAccess(req, res);
  throwIfNotAllowed(teamMember, 'team_invitation', 'delete');

  const { id, invitationId } = req.query as {
    id: string;
    invitationId: string;
  };
  console.warn('invitation query', req.query);
  await deleteTaskInvitation({ taskId: id, invitationId });
  console.log('invitation deleted');

  // sendAudit({
  //   action: 'member.invitation.delete',
  //   crud: 'd',
  //   user: teamMember.user,
  //   team: teamMember.team,
  // });

  // await sendEvent(teamMember.teamId, 'invitation.removed', invitation);

  res.status(200).json({ data: {} });
};

// Accept an invitation to an organization
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { inviteToken } = req.body as {
    inviteToken: string;
    taskId: string;
    transcriberId: string;
  };

  const session = await getSession(req, res);
  const userId = session?.user?.id as string;

  const invitation = await getInvitation({ token: inviteToken });

  const teamMember = await addTeamMember(
    invitation.team.id,
    userId,
    invitation.role
  );

  await sendEvent(invitation.team.id, 'member.created', teamMember);

  await deleteInvitation({ token: inviteToken });

  res.status(200).json({ data: {} });
};
