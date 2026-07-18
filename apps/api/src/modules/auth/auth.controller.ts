import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      // Store refreshToken in HTTP-only cookie for silent refresh
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        data: {
          token: result.token,
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('refreshToken');
      res.json({ data: { success: true } });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await AuthService.getMe(userId);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { notificationThreshold } = req.body;
      const updatedUser = await AuthService.updateMe(userId, notificationThreshold);
      res.json({ data: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}
