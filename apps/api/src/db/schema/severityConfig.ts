import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';

export const severityConfig = pgTable('severity_config', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  factorName: varchar('factor_name', { length: 50 }).notNull().unique(), // e.g. change_area, dist_protected_area etc.
  factorLabel: varchar('factor_label', { length: 100 }).notNull(),
  weightPct: integer('weight_pct').notNull(), // weight as integer percentage (0-100)
  updatedBy: uuid('updated_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type SeverityConfigFactor = typeof severityConfig.$inferSelect;
export type NewSeverityConfigFactor = typeof severityConfig.$inferInsert;
