import rateLimit from 'express-rate-limit';
import { ERROR_CODES } from '@satmss/shared-constants';

const windowMs = parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '900000', 10);
const max = parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] ?? '100', 10);

export const apiRateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: ERROR_CODES.RATE_LIMITED,
      message: 'Too many requests from this IP, please try again later.',
    },
  },
});

const authWindowMs = parseInt(process.env['AUTH_RATE_LIMIT_WINDOW_MS'] ?? '900000', 10);
const authMax = parseInt(process.env['AUTH_RATE_LIMIT_MAX_ATTEMPTS'] ?? '10', 10);

export const authRateLimiter = rateLimit({
  windowMs: authWindowMs,
  max: authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: ERROR_CODES.RATE_LIMITED,
      message: 'Too many login attempts from this IP, please try again later.',
    },
  },
});
