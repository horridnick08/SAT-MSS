import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { alerts } from './alerts.js';

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  alertId: uuid('alert_id').references(() => alerts.id, { onDelete: 'restrict' }),
  type: varchar('type', { length: 20 }).notNull().$type<'IN_PLATFORM' | 'EMAIL'>(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
