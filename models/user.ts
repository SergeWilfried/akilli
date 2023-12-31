import { ApiError } from '@/lib/errors';
import { Action, Resource, permissions } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { Role, Transcriber } from '@prisma/client';
import type { Session } from 'next-auth';

export const createUser = async (param: {
  name: string;
  email: string;
  password?: string;
  mobile: string;
  country: string;
}) => {
  const { name, email, password, mobile, country } = param;

  return await prisma.user.create({
    data: {
      name,
      email,
      password: password ? password : '',
      mobileNumber: mobile,
      country: country,
    },
  });
};

export const getUser = async (key: { id: string } | { email: string }) => {
  return await prisma.user.findUnique({
    where: key,
  });
};

export const updateUser = async (param: {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  country: string;
}) => {
  const { name, email, mobileNumber, country } = param;

  return await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      name,
      mobileNumber: mobileNumber,
      country: country,
    },
  });
};

export const getUserBySession = async (session: Session | null) => {
  if (session === null || session.user === null) {
    return null;
  }

  const id = session?.user?.id;

  if (!id) {
    return null;
  }

  return await getUser({ id });
};

export const deleteUser = async (key: { id: string } | { email: string }) => {
  return await prisma.user.delete({
    where: key,
  });
};

export const isAllowed = (role: Role, resource: Resource, action: Action) => {
  const rolePermissions = permissions[role];
  console.warn(role);
  console.warn(rolePermissions);

  if (!rolePermissions) {
    return false;
  }

  for (const permission of rolePermissions) {
    if (permission.resource === resource) {
      if (permission.actions === '*' || permission.actions.includes(action)) {
        return true;
      }
    }
  }

  return false;
};

export const throwIfNotAllowed = (
  teamMember: Transcriber,
  resource: Resource,
  action: Action
) => {
  if (isAllowed(teamMember.role, resource, action)) {
    return true;
  }

  throw new ApiError(
    403,
    `You are not allowed to perform ${action} on ${resource}`
  );
};
