import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { caseFiles } from './caseFiles.js';
import { users } from './users.js';

export const caseFileAudit = pgTable('case_file_audit', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  caseFileId: uuid('case_file_id').notNull().references(() => caseFiles.id, { onDelete: 'restrict' }),
  action: varchar('action', { length: 30 }).notNull()
    .$type<'VIEW' | 'EDIT' | 'EXPORT_PDF' | 'EXPORT_GEOJSON' | 'STATUS_CHANGE'>(),
  performedBy: uuid('performed_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type CaseFileAuditEntry = typeof caseFileAudit.$inferSelect;
export type NewCaseFileAuditEntry = typeof caseFileAudit.$inferInsert;
