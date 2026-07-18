import type { Request, Response, NextFunction } from 'express';
import { ROLE_HIERARCHY, type UserRole } from '@satmss/shared-constants';
import { ERROR_CODES } from '@satmss/shared-constants';

export function authorize(minimumRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'User authentication required for authorization checks.',
        },
      });
      return;
    }

    const userRoleIndex = ROLE_HIERARCHY[req.user.role];
    const minimumRoleIndex = ROLE_HIERARCHY[minimumRole];

    if (userRoleIndex === undefined || minimumRoleIndex === undefined || userRoleIndex < minimumRoleIndex) {
      res.status(403).json({
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: `Insufficient permissions. Minimum role required: ${minimumRole}.`,
        },
      });
      return;
    }

    next();
  };
}
