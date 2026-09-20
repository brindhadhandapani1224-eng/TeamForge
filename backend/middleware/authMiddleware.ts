import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'student' | 'admin';
  };
}

export const JWT_SECRET = process.env.JWT_SECRET || 'teamforge_jwt_dev_secret_key_2026';

/**
 * Protect routes: requires valid Bearer token in Authorization header
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'student' | 'admin' };
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
    });
  }
};

/**
 * Admin authorization check
 */
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.',
    });
    return;
  }
  next();
};
