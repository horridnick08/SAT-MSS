import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

// Stub for MVP endpoints
router.get('/datasets', authenticate, (_req, res) => {
  res.json({ data: [] });
});

export const boundariesRouter: Router = router;
