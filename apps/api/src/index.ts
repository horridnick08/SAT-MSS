import 'dotenv/config';
import { createApp } from './app.js';
import { createServer } from 'http';
import { initializeSocket } from './websocket/socket.js';
import { logger } from './lib/logger.js';
import { db } from './db/client.js';
import { sql } from 'drizzle-orm';

const PORT = parseInt(process.env['API_PORT'] ?? '3001', 10);

async function main(): Promise<void> {
  // Verify database connectivity
  try {
    await db.execute(sql`SELECT 1`);
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Failed to connect to database', { error });
    process.exit(1);
  }

  const app = createApp();
  const httpServer = createServer(app);

  // Initialize Socket.IO
  initializeSocket(httpServer);
  logger.info('WebSocket server initialized');

  httpServer.listen(PORT, () => {
    logger.info(`SAT-MSS API server running`, {
      port: PORT,
      environment: process.env['NODE_ENV'] ?? 'development',
      nodeVersion: process.version,
    });
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error });
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', { reason });
    process.exit(1);
  });
}

void main();
// Trigger dev server restart after env update
