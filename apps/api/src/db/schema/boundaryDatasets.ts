import { pgTable, uuid, varchar, boolean, timestamp, integer, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';

export const boundaryDatasets = pgTable('boundary_datasets', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 200 }).notNull(),
  type: varchar('type', { length: 20 }).notNull().$type<'CONCESSION' | 'PROTECTED_AREA'>(),
  stateCode: varchar('state_code', { length: 5 }).notNull(),
  validityDate: varchar('validity_date', { length: 10 }).notNull(), // YYYY-MM-DD
  isActive: boolean('is_active').notNull().default(false),
  polygonCount: integer('polygon_count').notNull().default(0),
  fileFormat: varchar('file_format', { length: 20 }).notNull(), // GEOJSON | KML | SHAPEFILE
  storageKey: text('storage_key'), // Original file in object storage
  notes: text('notes'),
  importedBy: uuid('imported_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  importedAt: timestamp('imported_at', { withTimezone: true }).notNull().defaultNow(),
  activatedAt: timestamp('activated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type BoundaryDataset = typeof boundaryDatasets.$inferSelect;
export type NewBoundaryDataset = typeof boundaryDatasets.$inferInsert;
