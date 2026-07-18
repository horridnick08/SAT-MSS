import { pgTable, uuid, varchar, boolean, real, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { aois } from './aois.js';
import { changeZones } from './changeZones.js';
import { analysisRuns } from './analysisRuns.js';

export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  aoiId: uuid('aoi_id').notNull().references(() => aois.id, { onDelete: 'restrict' }),
  primaryZoneId: uuid('primary_zone_id').notNull().references(() => changeZones.id, { onDelete: 'restrict' }),
  runId: uuid('run_id').notNull().references(() => analysisRuns.id, { onDelete: 'restrict' }),
  severityScore: real('severity_score').notNull(),
  intersectionCategory: varchar('intersection_category', { length: 40 }).notNull()
    .$type<'FULLY_WITHIN_CONCESSION' | 'CONCESSION_VIOLATION' | 'PROTECTED_AREA_INCURSION' | 'NO_CONCESSION_OVERLAP'>(),
  totalAreaHa: real('total_area_ha').notNull(),
  zoneCount: real('zone_count').notNull(),
  status: varchar('status', { length: 40 }).notNull()
    .$type<
      | 'PENDING_REVIEW'
      | 'UNDER_REVIEW'
      | 'CONFIRMED_ILLEGAL'
      | 'CONFIRMED_LEGAL'
      | 'FALSE_POSITIVE_NATURAL'
      | 'FALSE_POSITIVE_DATA_ERROR'
      | 'ESCALATED_TO_ENFORCEMENT'
    >()
    .default('PENDING_REVIEW'),
  isDuplicate: boolean('is_duplicate').notNull().default(false),
  isPotentialDuplicate: boolean('is_potential_duplicate').notNull().default(false),
  parentAlertId: uuid('parent_alert_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;
