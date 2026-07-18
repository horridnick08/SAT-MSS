import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

// Stub for MVP endpoints
router.get('/users', authenticate, (_req, res) => {
  res.json({ data: [] });
});

export const adminRouter: Router = router;
