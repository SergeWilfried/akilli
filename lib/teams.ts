import { Role, Transcriber } from '@prisma/client';
import type { User } from 'next-auth';

export const isTeamAdmin = (user: User, members: Transcriber[]) => {
  return (
    members.filter(
      (member) =>
        member.userId === user.id &&
        (member.role === Role.ADMIN || member.role === Role.OWNER)
    ).length > 0
  );
};
