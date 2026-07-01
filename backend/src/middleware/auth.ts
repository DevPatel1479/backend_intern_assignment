import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;

  const cookieToken = req.cookies?.[env.COOKIE_NAME] ?? null;
  const token = headerToken ?? cookieToken;

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role as 'USER' | 'ADMIN',
      email: payload.email,
      name: payload.name
    };
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

export function authorize(...roles: Array<'USER' | 'ADMIN'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden'));
    }

    next();
  };
}
