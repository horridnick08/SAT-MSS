import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateMeSchema = z.object({
  body: z.object({
    notificationThreshold: z.number().int().min(1).max(100, 'Threshold must be between 1 and 100'),
  }),
});
