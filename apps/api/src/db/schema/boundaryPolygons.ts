import { pgTable, uuid, varchar, text, real } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { geometryMultiPolygon } from './customTypes.js';
import { boundaryDatasets } from './boundaryDatasets.js';

export const boundaryPolygons = pgTable('boundary_polygons', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  datasetId: uuid('dataset_id').notNull().references(() => boundaryDatasets.id, { onDelete: 'restrict' }),
  name: varchar('name', { length: 200 }).notNull(),
  permitNumber: varchar('permit_number', { length: 100 }),
  permitStatus: varchar('permit_status', { length: 50 }),
  geometry: geometryMultiPolygon('geometry').notNull(),
  maxDisturbanceHa: real('max_disturbance_ha'),
  externalId: varchar('external_id', { length: 100 }), // Original ID from source dataset
  metadata: text('metadata'), // JSON string for any additional source metadata
});

export type BoundaryPolygon = typeof boundaryPolygons.$inferSelect;
export type NewBoundaryPolygon = typeof boundaryPolygons.$inferInsert;
