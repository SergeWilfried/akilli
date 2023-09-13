import type { Prisma } from '@prisma/client';

export type ApiError = {
  code?: string;
  message: string;
  values: { [key: string]: string };
};

export type ApiResponse<T = unknown> =
  | {
      data: T;
      error: never;
    }
  | {
      data: never;
      error: ApiError;
    };

export type Role = 'owner' | 'member';

export type SPSAMLConfig = {
  issuer: string;
  acs: string;
};

export type TeamWithMemberCount = Prisma.TeamGetPayload<{
  include: {
    _count: {
      select: { transcribers: true };
    };
  };
}>;

export type WebookFormSchema = {
  name: string;
  url: string;
  eventTypes: string[];
};

export type Language = {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  transcribers: Transcriber[];
};

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  password?: string;
  mobileNumber: string;
  country: string;
  gender?: string;
  age?: string;
  role: Role;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  transcribers: Transcriber[];
  accounts: [];
  sessions: [];
  invitations: Invitation[];
}

interface Team {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  defaultRole: Role;
  createdAt: Date;
  updatedAt: Date;
  translators: Transcriber[];
  invitations: Invitation[];
  apiKeys: ApiKey[];
}

export interface Transcriber {
  id: string;
  name?: string;
  gender?: string;
  role: Role;
  age?: string;
  email?: string;
  languages: Language[];
  tasks: Task[];
  team: Team;
  teamId: string;
  payments: Payment[];
  rating: Rating[];
  user: User;
  userId: string;
}

export interface Invitation {
  id: string;
  teamId: string;
  email: string;
  role: Role;
  token: string;
  expires: Date;
  invitedBy: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  team: Team;
}

export interface Task {
  id: string;
  audioFileUrl: string;
  textFileUrl: string;
  status?: string;
  deadline: Date;
  assignedTranscriber?: Transcriber | null;
  assignedTranscriberId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  userId?: string;
}
export interface NewTaskInput {
  language: string;
  name: string;
  type: string;
  file: any;
}
export interface ApiKey {
  id: string;
  name: string;
  teamId: string;
  hashedKey: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  team: Team;
}

export interface Address {
  id: number;
  city: string;
  state: string;
  country: string;
  translator: Transcriber[];
}

interface Payment {
  id: string;
  transcriber: Transcriber;
  transcriberId: string;
  amount: number;
  date: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Rating {
  id: string;
  transcriber: Transcriber;
  transcriberId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const MAX_FILE_SIZE = 10485760; // 10MB
const validFileExtensions = {
  audio: ['mp3', 'wav', 'flac', 'aac', 'ogg'],
};
export function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
  );
}
