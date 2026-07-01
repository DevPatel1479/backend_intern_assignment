import { Prisma, TaskStatus } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  }
} satisfies Prisma.TaskSelect;

export async function createTask(input: {
  title: string;
  description?: string | null;
  status?: keyof typeof TaskStatus;
  userId: string;
}) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description?.trim() || null,
      status: input.status ?? 'TODO',
      userId: input.userId
    },
    select: taskSelect
  });
}

export async function listTasksForUser(userId: string, isAdmin: boolean) {
  return prisma.task.findMany({
    where: isAdmin ? {} : { userId },
    orderBy: { createdAt: 'desc' },
    select: taskSelect
  });
}

export async function getTaskById(taskId: string, userId: string, isAdmin: boolean) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: taskSelect
  });

  if (!task) throw new ApiError(404, 'Task not found');
  if (!isAdmin && task.userId !== userId) throw new ApiError(403, 'Forbidden');

  return task;
}

export async function updateTask(taskId: string, userId: string, isAdmin: boolean, input: {
  title?: string;
  description?: string | null;
  status?: keyof typeof TaskStatus;
}) {
  const existing = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, userId: true }
  });

  if (!existing) throw new ApiError(404, 'Task not found');
  if (!isAdmin && existing.userId !== userId) throw new ApiError(403, 'Forbidden');

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.status !== undefined ? { status: input.status } : {})
    },
    select: taskSelect
  });
}

export async function deleteTask(taskId: string, userId: string, isAdmin: boolean) {
  const existing = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, userId: true }
  });

  if (!existing) throw new ApiError(404, 'Task not found');
  if (!isAdmin && existing.userId !== userId) throw new ApiError(403, 'Forbidden');

  await prisma.task.delete({ where: { id: taskId } });
  return { deleted: true };
}

export async function listAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
}
