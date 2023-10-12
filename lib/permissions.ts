import { Role } from '@prisma/client';

export type RoleType = (typeof Role)[keyof typeof Role];
export type Action = 'create' | 'update' | 'read' | 'delete' | 'leave';
export type Resource =
  | 'team'
  | 'team_member'
  | 'team_invitation'
  | 'team_sso'
  | 'team_dsync'
  | 'team_audit_log'
  | 'team_webhook'
  | 'task'
  | 'transcript'
  | 'language'
  | 'team_api_key';

export type RolePermissions = {
  [role in RoleType]: Permission[];
};

export type Permission = {
  resource: Resource;
  actions: Action[] | '*';
};

export const availableRoles = [
  {
    id: Role.MEMBER,
    name: 'Member',
  },
  {
    id: Role.ADMIN,
    name: 'Admin',
  },
  {
    id: Role.OWNER,
    name: 'Owner',
  },
  {
    id: Role.TRANSCRIBER,
    name: 'Transcriber',
  },
];

export const permissions: RolePermissions = {
  OWNER: [
    {
      resource: 'team',
      actions: '*',
    },
    {
      resource: 'team_member',
      actions: '*',
    },
    {
      resource: 'team_invitation',
      actions: '*',
    },
    {
      resource: 'language',
      actions: '*',
    },
    {
      resource: 'transcript',
      actions: '*',
    },
    {
      resource: 'team_sso',
      actions: '*',
    },
    {
      resource: 'team_dsync',
      actions: '*',
    },
    {
      resource: 'team_audit_log',
      actions: '*',
    },
    {
      resource: 'team_webhook',
      actions: '*',
    },
    {
      resource: 'team_api_key',
      actions: '*',
    },
    {
      resource: 'task',
      actions: '*',
    },
  ],
  ADMIN: [
    {
      resource: 'team',
      actions: '*',
    },
    {
      resource: 'transcript',
      actions: '*',
    },
    {
      resource: 'task',
      actions: '*',
    },
    {
      resource: 'language',
      actions: '*',
    },
    {
      resource: 'team_member',
      actions: '*',
    },
    {
      resource: 'team_invitation',
      actions: '*',
    },
    {
      resource: 'team_sso',
      actions: '*',
    },
    {
      resource: 'team_dsync',
      actions: '*',
    },
    {
      resource: 'team_audit_log',
      actions: '*',
    },
    {
      resource: 'team_webhook',
      actions: '*',
    },
    {
      resource: 'team_api_key',
      actions: '*',
    },
  ],
  MEMBER: [
    {
      resource: 'team',
      actions: ['read', 'leave'],
    },
  ],
  TRANSCRIBER: [
    {
      resource: 'team',
      actions: ['read', 'leave'],
    },
    {
      resource: 'language',
      actions: ['read'],
    },
    {
      resource: 'task',
      actions: ['read', 'leave'],
    },
    {
      resource: 'transcript',
      actions: '*',
    },
  ],
};

export const tasksType = [
  {
    id: '0',
    name: 'TEXT TO VOICE',
  },
  {
    id: '1',
    name: 'VOICE TO TEXT',
  },
  {
    id: '2',
    name: 'TEXT TO TEXT',
  },
];

export const TaskStatus = [
  {
    id: '0',
    name: 'STARTED',
    value: 'STARTED',
  },
  {
    id: '1',
    name: 'PENDING',
    value: 'PENDING',
  },
  {
    id: '2',
    name: 'INPROGRESS',
    value: 'INPROGRESS',
  },
  {
    id: '3',
    name: 'COMPLETE',
    value: 'COMPLETE',
  },
];
