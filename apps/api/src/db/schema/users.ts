import { pgTable, uuid, varchar, boolean, timestamp, integer, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  organization: varchar('organization', { length: 150 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().$type<'FIELD_RANGER' | 'ANALYST' | 'DIRECTOR' | 'ADMIN'>(),
  isActive: boolean('is_active').notNull().default(true),
  notificationThreshold: integer('notification_threshold').notNull().default(70),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdBy: uuid('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  // TOTP secret for 2FA (nullable until enrolled)
  totpSecret: text('totp_secret'),
  isTotpEnabled: boolean('is_totp_enabled').notNull().default(false),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
