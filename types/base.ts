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
      select: { translators: true };
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
  createdAt: Date;
  updatedAt: Date;
  transcripts: Transcript[];
  audios: AudioTranscript[];
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
  translators: Translator[];
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
  translators: Translator[];
  invitations: Invitation[];
  apiKeys: ApiKey[];
  transcripts: Transcript[];
}

interface Translator {
  id: string;
  teamId: string;
  userId: string;
  address?: Address;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  team: Team;
  user: User;
  audiosTranscripts: AudioTranscript[];
  transcripts: Transcript[];
  addressId?: number;
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

export interface Transcript {
  id: string;
  topic?: string;
  text: string;
  textLang: string;
  transcript: string;
  transcriptionLang?: Language;
  transcriptionLangId?: string;
  audios: AudioTranscript[];
  translator?: Translator;
  translatorId?: string;
  createdAt: Date;
  updatedAt: Date;
  Team?: Team;
  teamId?: string;
}

export interface AudioTranscript {
  id: string;
  transcript?: Transcript;
  transcriptId?: string;
  language?: Language;
  languageId?: string;
  url: string;
  fileFormat: string;
  createdAt: Date;
  updatedAt: Date;
  translator?: Translator;
  translatorId?: string;
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
  translator: Translator[];
}
