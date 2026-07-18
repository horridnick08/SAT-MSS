import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client.js';
import { logger } from '../lib/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations(): Promise<void> {
  logger.info('Starting database migrations...');
  try {
    // Run migrations stored in drizzle directory
    await migrate(db, {
      migrationsFolder: path.join(__dirname, '../../drizzle'),
    });
    logger.info('Database migrations completed successfully');
  } catch (error) {
    logger.error('Failed to run database migrations', { error: error instanceof Error ? { message: error.message, stack: error.stack } : error });
    process.exit(1);
  } finally {
    await pool.end();
  }
}

void runMigrations();
