import { pgTable, uuid, varchar, boolean, real, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { geometryPolygon, geometryPoint } from './customTypes.js';
import { analysisRuns } from './analysisRuns.js';

export const changeZones = pgTable('change_zones', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  runId: uuid('run_id').notNull().references(() => analysisRuns.id, { onDelete: 'restrict' }),
  changeType: varchar('change_type', { length: 20 }).notNull()
    .$type<'VEGETATION_LOSS' | 'BARE_EARTH' | 'WATER_BODY' | 'ACCESS_ROAD'>(),
  geometry: geometryPolygon('geometry').notNull(),
  areaSqm: real('area_sqm').notNull(),
  areaHa: real('area_ha').notNull(),
  centroid: geometryPoint('centroid').notNull(),
  intersectionCategory: varchar('intersection_category', { length: 40 }).notNull()
    .$type<'FULLY_WITHIN_CONCESSION' | 'CONCESSION_VIOLATION' | 'PROTECTED_AREA_INCURSION' | 'NO_CONCESSION_OVERLAP'>(),
  distToProtectedAreaM: real('dist_to_protected_area_m').notNull(),
  distToWaterBodyM: real('dist_to_water_body_m').notNull(),
  ndviDelta: real('ndvi_delta').notNull(),
  swirRatio: real('swir_ratio'),
  severityScore: real('severity_score').notNull(),
  isFlaggedEvidence: boolean('is_flagged_evidence').notNull().default(false),
  isDismissed: boolean('is_dismissed').notNull().default(false),
  dismissalReason: text('dismissal_reason'),
});

export type ChangeZone = typeof changeZones.$inferSelect;
export type NewChangeZone = typeof changeZones.$inferInsert;
