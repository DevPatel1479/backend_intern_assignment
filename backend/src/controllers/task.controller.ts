import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createTask, deleteTask, getTaskById, listTasksForUser, updateTask, listAllUsers } from '../services/task.service.js';

export const listTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await listTasksForUser(req.user!.id, req.user!.role === 'ADMIN');

  res.status(200).json({
    success: true,
    data: { tasks }
  });
});

export const createOne = asyncHandler(async (req: Request, res: Response) => {
  const task = await createTask({
    ...req.body,
    userId: req.user!.id
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task }
  });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const task = await getTaskById(req.params.id, req.user!.id, req.user!.role === 'ADMIN');

  res.status(200).json({
    success: true,
    data: { task }
  });
});

export const updateOne = asyncHandler(async (req: Request, res: Response) => {
  const task = await updateTask(req.params.id, req.user!.id, req.user!.role === 'ADMIN', req.body);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: { task }
  });
});

export const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  await deleteTask(req.params.id, req.user!.id, req.user!.role === 'ADMIN');

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

export const adminUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await listAllUsers();

  res.status(200).json({
    success: true,
    data: { users }
  });
});
