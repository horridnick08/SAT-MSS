import { pgTable, uuid, varchar, timestamp, real, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { aois } from './aois.js';
import { imageryScenes } from './imageryScenes.js';

export const ingestionLog = pgTable('ingestion_log', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  aoiId: uuid('aoi_id').notNull().references(() => aois.id, { onDelete: 'restrict' }),
  // sceneId is null if ingestion failed
  sceneId: uuid('scene_id').references(() => imageryScenes.id, { onDelete: 'restrict' }),
  satelliteSource: varchar('satellite_source', { length: 20 }).notNull(),
  tileId: varchar('tile_id', { length: 50 }).notNull(),
  acquisitionDate: varchar('acquisition_date', { length: 10 }).notNull(),
  cloudCoverPct: real('cloud_cover_pct'),
  status: varchar('status', { length: 30 }).notNull()
    .$type<'SUCCESS' | 'FAILED' | 'SKIPPED_CLOUD_COVER' | 'ALREADY_EXISTS'>(),
  errorMessage: text('error_message'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
});

export type IngestionLog = typeof ingestionLog.$inferSelect;
export type NewIngestionLog = typeof ingestionLog.$inferInsert;
