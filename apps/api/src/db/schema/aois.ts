import { pgTable, uuid, varchar, boolean, timestamp, text, real } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { geometryPolygon } from './customTypes.js';
import { users } from './users.js';

export const aois = pgTable('aois', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 100 }).notNull(),
  // PostGIS geometry
  geometry: geometryPolygon('geometry').notNull(),
  stateCode: varchar('state_code', { length: 5 }).notNull(),
  stateName: varchar('state_name', { length: 100 }).notNull(),
  districtName: varchar('district_name', { length: 100 }).notNull(),
  priority: varchar('priority', { length: 10 }).notNull().$type<'HIGH' | 'MEDIUM' | 'LOW'>().default('MEDIUM'),
  isActive: boolean('is_active').notNull().default(true),
  notes: text('notes'),
  areaHa: real('area_ha'), // Pre-computed area in hectares
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Aoi = typeof aois.$inferSelect;
export type NewAoi = typeof aois.$inferInsert;
