import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

// Stub for MVP endpoints
router.get('/', authenticate, (_req, res) => {
  res.json({ data: [] });
});

export const notificationsRouter: Router = router;
