import { pgTable, uuid, varchar, timestamp, real, text, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { geometryPolygon } from './customTypes.js';
import { aois } from './aois.js';

export const imageryScenes = pgTable('imagery_scenes', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  aoiId: uuid('aoi_id').notNull().references(() => aois.id, { onDelete: 'restrict' }),
  satelliteSource: varchar('satellite_source', { length: 20 }).notNull()
    .$type<'SENTINEL_2A' | 'SENTINEL_2B' | 'SENTINEL_1A' | 'SENTINEL_1B'>(),
  tileId: varchar('tile_id', { length: 50 }).notNull(),
  acquisitionDate: varchar('acquisition_date', { length: 10 }).notNull(), // YYYY-MM-DD
  acquisitionDatetime: timestamp('acquisition_datetime', { withTimezone: true }).notNull(),
  cloudCoverPct: real('cloud_cover_pct').notNull(),
  processingLevel: varchar('processing_level', { length: 10 }).notNull(), // L1C, L2A, GRD
  storagePath: text('storage_path').notNull(), // Object storage key
  footprint: geometryPolygon('footprint').notNull(),
  availableBands: jsonb('available_bands').$type<string[]>().notNull().default([]),
  solarElevationDeg: real('solar_elevation_deg'),
  fileSizeBytes: real('file_size_bytes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ImageryScene = typeof imageryScenes.$inferSelect;
export type NewImageryScene = typeof imageryScenes.$inferInsert;
