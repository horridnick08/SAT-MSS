import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { caseFiles } from './caseFiles.js';
import { imageryScenes } from './imageryScenes.js';

export const caseFileEvidenceImages = pgTable('case_file_evidence_images', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  caseFileId: uuid('case_file_id').notNull().references(() => caseFiles.id, { onDelete: 'restrict' }),
  sceneId: uuid('scene_id').notNull().references(() => imageryScenes.id, { onDelete: 'restrict' }),
  caption: text('caption').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
});

export type CaseFileEvidenceImage = typeof caseFileEvidenceImages.$inferSelect;
export type NewCaseFileEvidenceImage = typeof caseFileEvidenceImages.$inferInsert;
