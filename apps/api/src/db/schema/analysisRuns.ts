import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { aois } from './aois.js';
import { imageryScenes } from './imageryScenes.js';
import { users } from './users.js';

export const analysisRuns = pgTable('analysis_runs', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  aoiId: uuid('aoi_id').notNull().references(() => aois.id, { onDelete: 'restrict' }),
  baselineSceneId: uuid('baseline_scene_id').notNull().references(() => imageryScenes.id, { onDelete: 'restrict' }),
  targetSceneId: uuid('target_scene_id').notNull().references(() => imageryScenes.id, { onDelete: 'restrict' }),
  sensitivityLevel: varchar('sensitivity_level', { length: 10 }).notNull()
    .$type<'STANDARD' | 'HIGH'>().default('STANDARD'),
  status: varchar('status', { length: 20 }).notNull()
    .$type<'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'>().default('QUEUED'),
  progressPct: varchar('progress_pct', { length: 5 }).notNull().default('0'),
  currentPhase: varchar('current_phase', { length: 30 }),
  triggeredBy: uuid('triggered_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  gseJobId: varchar('gse_job_id', { length: 100 }), // Celery task ID from GSE
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  errorMessage: text('error_message'),
  processingMetadata: text('processing_metadata'), // JSON: cloud cover stats, NDVI means etc.
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type AnalysisRun = typeof analysisRuns.$inferSelect;
export type NewAnalysisRun = typeof analysisRuns.$inferInsert;
