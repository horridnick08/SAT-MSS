import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';
import { ERROR_CODES } from '@satmss/shared-constants';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: Array<{ field: string; message: string }>;
}

export function globalErrorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? 500;
  const errorCode = err.code ?? ERROR_CODES.INTERNAL_ERROR;
  const correlationId = req.headers['x-correlation-id'] as string | undefined;

  logger.error('Unhandled request error', {
    message: err.message,
    stack: err.stack,
    code: errorCode,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    correlationId,
  });

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: err.message || 'An unexpected error occurred.',
      details: err.details,
      correlationId,
    },
  });
}
