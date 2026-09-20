import { Request, Response, NextFunction } from 'express';

/**
 * 404 handler for unknown API routes
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
};

/**
 * Centralized error handling middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[Server Error]:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
