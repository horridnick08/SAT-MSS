import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';
import { v4 as uuidv4 } from 'uuid';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  
  // Set on request and response headers
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
      correlationId,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    });
  });

  next();
}
