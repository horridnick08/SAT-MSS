import type { Request, Response, NextFunction } from 'express';
import type { AnyZodObject } from 'zod';
import { ERROR_CODES } from '@satmss/shared-constants';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Mutate requests to match parsed Zod values (like casting types)
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;
      next();
    } catch (error: any) {
      const details = error.errors?.map((err: any) => ({
        field: err.path.join('.').replace(/^(body|query|params)\./, ''),
        message: err.message,
      }));

      res.status(400).json({
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation failed for request parameters.',
          details,
        },
      });
    }
  };
}
