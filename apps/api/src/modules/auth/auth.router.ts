import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { loginSchema, updateMeSchema } from './auth.validation.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/login', authRateLimiter, validate(loginSchema), AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.me);
router.patch('/me', authenticate, validate(updateMeSchema), AuthController.updateMe);

export const authRouter: Router = router;
