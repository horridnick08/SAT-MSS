import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { alerts } from './alerts.js';
import { users } from './users.js';

export const alertStatusLog = pgTable('alert_status_log', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  alertId: uuid('alert_id').notNull().references(() => alerts.id, { onDelete: 'restrict' }),
  previousStatus: varchar('previous_status', { length: 40 })
    .$type<
      | 'PENDING_REVIEW'
      | 'UNDER_REVIEW'
      | 'CONFIRMED_ILLEGAL'
      | 'CONFIRMED_LEGAL'
      | 'FALSE_POSITIVE_NATURAL'
      | 'FALSE_POSITIVE_DATA_ERROR'
      | 'ESCALATED_TO_ENFORCEMENT'
    >(),
  newStatus: varchar('new_status', { length: 40 }).notNull()
    .$type<
      | 'PENDING_REVIEW'
      | 'UNDER_REVIEW'
      | 'CONFIRMED_ILLEGAL'
      | 'CONFIRMED_LEGAL'
      | 'FALSE_POSITIVE_NATURAL'
      | 'FALSE_POSITIVE_DATA_ERROR'
      | 'ESCALATED_TO_ENFORCEMENT'
    >(),
  changedBy: uuid('changed_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  justificationNote: text('justification_note').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type AlertStatusLogEntry = typeof alertStatusLog.$inferSelect;
export type NewAlertStatusLogEntry = typeof alertStatusLog.$inferInsert;
