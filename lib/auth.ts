import { compare, hash } from 'bcryptjs';
import { passwordPolicies } from './common';
import { ApiError } from './errors';

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export const validatePasswordPolicy = (password: string) => {
  const { minLength } = passwordPolicies;

  if (password.length < minLength) {
    throw new ApiError(
      422,
      `Password must have at least ${minLength} characters.`
    );
  }

  // TODO: Add more password policies
};
