import { Role, type User } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken } from '../utils/jwt.js';

function sanitizeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ApiError(409, 'Email already registered');

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: Role.USER
    }
  });

  const token = signAccessToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name
  });

  return { user: sanitizeUser(user), token };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() }
  });

  if (!user) throw new ApiError(401, 'Invalid credentials');

  const isPasswordValid = await comparePassword(input.password, user.passwordHash);
  if (!isPasswordValid) throw new ApiError(401, 'Invalid credentials');

  const token = signAccessToken({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name
  });

  return { user: sanitizeUser(user), token };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) throw new ApiError(404, 'User not found');

  return user;
}
