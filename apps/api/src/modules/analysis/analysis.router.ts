import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

// Stub for MVP endpoints
router.get('/:aoiId/analyses', authenticate, (_req, res) => {
  res.json({ data: [] });
});

export const analysisRouter: Router = router;
