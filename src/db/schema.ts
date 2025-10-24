import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// Profiles mirror Supabase auth.users (use auth user id as primary key)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Supabase auth user id (UUID string)
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
});





