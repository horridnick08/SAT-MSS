import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'FIELD_RANGER' | 'ANALYST' | 'DIRECTOR' | 'ADMIN';
        name: string;
        organization: string;
      };
    }
  }
}
