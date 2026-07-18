import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middleware/requestLogger.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.router.js';
import { aoiRouter } from './modules/aoi/aoi.router.js';
import { imageryRouter } from './modules/imagery/imagery.router.js';
import { boundariesRouter } from './modules/boundaries/boundaries.router.js';
import { analysisRouter } from './modules/analysis/analysis.router.js';
import { alertsRouter } from './modules/alerts/alerts.router.js';
import { casesRouter } from './modules/cases/cases.router.js';
import { reportsRouter } from './modules/reports/reports.router.js';
import { adminRouter } from './modules/admin/admin.router.js';
import { notificationsRouter } from './modules/notifications/notifications.router.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

export function createApp(): Express {
  const app = express();

  // ── Trust proxy (when behind Nginx) ─────────────────────────────────────
  app.set('trust proxy', 1);

  // ── Security Headers ─────────────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: false, // Configured separately for Cesium requirements
      crossOriginEmbedderPolicy: false,
    }),
  );

  // ── CORS ─────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // ── Body Parsers ─────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ── Request Logging ───────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  app.use('/api/', apiRateLimiter);

  // ── Health Check (no auth required) ──────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'satmss-api',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // ── API Routes ────────────────────────────────────────────────────────────
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/aois', aoiRouter);
  app.use('/api/v1/aois', imageryRouter); // Imagery routes are nested under AOIs
  app.use('/api/v1/scenes', imageryRouter);
  app.use('/api/v1/boundaries', boundariesRouter);
  app.use('/api/v1/aois', analysisRouter); // Analysis routes nested under AOIs
  app.use('/api/v1/analyses', analysisRouter);
  app.use('/api/v1/alerts', alertsRouter);
  app.use('/api/v1/case-files', casesRouter);
  app.use('/api/v1/dashboard', reportsRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/notifications', notificationsRouter);

  // ── 404 Handler ───────────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'The requested endpoint does not exist.',
      },
    });
  });

  // ── Global Error Handler (must be last) ──────────────────────────────────
  app.use(globalErrorHandler as express.ErrorRequestHandler);

  return app;
}
