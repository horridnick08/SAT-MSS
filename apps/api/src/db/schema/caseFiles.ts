import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { alerts } from './alerts.js';
import { users } from './users.js';

export const caseFiles = pgTable('case_files', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  referenceNumber: varchar('reference_number', { length: 20 }).notNull().unique(), // e.g. CF-2026-0047
  alertId: uuid('alert_id').notNull().references(() => alerts.id, { onDelete: 'restrict' }),
  status: varchar('status', { length: 20 }).notNull().$type<'DRAFT' | 'COMPLETE' | 'EXPORTED'>().default('DRAFT'),
  compiledBy: uuid('compiled_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  analystNotes: text('analyst_notes'),
  recommendation: varchar('recommendation', { length: 100 }),
  recommendationDetail: text('recommendation_detail'),
  pdfStoragePath: text('pdf_storage_path'), // MinIO/S3 object path
  geojsonStoragePath: text('geojson_storage_path'), // MinIO/S3 object path
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type CaseFile = typeof caseFiles.$inferSelect;
export type NewCaseFile = typeof caseFiles.$inferInsert;
