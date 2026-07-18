import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

// Stub for MVP endpoints
router.get('/:aoiId/scenes', authenticate, (_req, res) => {
  res.json({ data: [] });
});

export const imageryRouter: Router = router;
