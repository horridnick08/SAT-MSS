import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { logger } from '../lib/logger.js';
import * as schema from './schema/index.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  min: parseInt(process.env['DATABASE_POOL_MIN'] ?? '2', 10),
  max: parseInt(process.env['DATABASE_POOL_MAX'] ?? '10', 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
  logger.error('PostgreSQL pool error', { error: err.message });
});

pool.on('connect', () => {
  logger.debug('New database connection established');
});

export const db = drizzle(pool, { schema });

export { pool };
