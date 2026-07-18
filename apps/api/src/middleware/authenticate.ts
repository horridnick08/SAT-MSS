import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/client.js';
import { users } from '../db/schema/users.js';
import { eq } from 'drizzle-orm';
import { ERROR_CODES } from '@satmss/shared-constants';
import { logger } from '../lib/logger.js';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'default_secret';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication token is missing or invalid.',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication token is empty.',
      },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      role: 'FIELD_RANGER' | 'ANALYST' | 'DIRECTOR' | 'ADMIN';
    };

    const [userRecord] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        organization: users.organization,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, decoded.sub))
      .limit(1);

    if (!userRecord || !userRecord.isActive) {
      res.status(401).json({
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'User account is deactivated or not found.',
        },
      });
      return;
    }

    req.user = {
      id: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      name: userRecord.name,
      organization: userRecord.organization,
    };

    next();
  } catch (error) {
    logger.error('JWT Authentication failed', { error });
    res.status(401).json({
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication token is expired or signature is invalid.',
      },
    });
  }
}
