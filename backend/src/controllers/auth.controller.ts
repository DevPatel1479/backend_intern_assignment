import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginUser, registerUser, getCurrentUser } from '../services/auth.service.js';
import { clearAuthCookie, setAuthCookie } from '../utils/cookies.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  setAuthCookie(res, result.token);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user: result.user }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  setAuthCookie(res, result.token);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user: result.user }
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.id);

  res.status(200).json({
    success: true,
    data: { user }
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
