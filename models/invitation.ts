import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const getInvitations = async (teamId: string) => {
  return await prisma.invitation.findMany({
    where: {
      teamId,
    },
  });
};

export const getInvitation = async (
  key: { token: string } | { id: string }
) => {
  return await prisma.invitation.findUniqueOrThrow({
    where: key,
    include: {
      team: true,
    },
  });
};

export const getTaskInvitations = async (key: { id: string }) => {
  const invitations = await prisma.task.findUniqueOrThrow({
    where: key,
    include: {
      invitations: true,
    },
  });
  return invitations.invitations;
};

export const getTaskInvitation = async (key: {
  taskId: string;
  invitationId: string;
}) => {
  const { taskId, invitationId } = key;
  const invitations = await prisma.task.findUniqueOrThrow({
    where: {
      id: taskId,
    },
    include: {
      invitations: true,
    },
  });
  return invitations.invitations.filter((f) => f.id === invitationId);
};

export const deleteTaskInvitation = async (key: {
  taskId: string;
  invitationId: string;
}) => {
  const { taskId, invitationId } = key;
  const tasks = await prisma.task.findUniqueOrThrow({
    where: {
      id: taskId,
    },
    include: {
      invitations: true,
    },
  });
  const sin = tasks.invitations.filter((f) => f.id === invitationId);
  console.log('invitations', tasks.invitations);
  console.log('invitation found', sin);

  await prisma.invitation.delete({
    where: {
      id: sin[0].id,
    },
  });
  return [];
};

export const createInvitation = async (param: {
  teamId: string;
  invitedBy: string;
  email: string;
  role: Role;
  taskId: string;
}) => {
  const { teamId, invitedBy, email, role, taskId } = param;

  return await prisma.invitation.create({
    data: {
      token: uuidv4(),
      expires: new Date(),
      teamId,
      invitedBy,
      email,
      role,
      taskId,
    },
  });
};

export const deleteInvitation = async (
  key: { token: string } | { id: string }
) => {
  return await prisma.invitation.delete({
    where: key,
  });
};
