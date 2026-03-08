import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistEntries).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;

export const synchronicityEvents = pgTable("synchronicity_events", {
  id: serial("id").primaryKey(),
  participantA: text("participant_a").notNull(),
  participantB: text("participant_b").notNull(),
  objectType: text("object_type").notNull(),
  objectTitle: text("object_title").notNull(),
  objectId: text("object_id").notNull(),
  evidenceClass: text("evidence_class").notNull().default("strong"),
  deltaSeconds: integer("delta_seconds").notNull(),
  score: integer("score").notNull(),
  resolvedAt: timestamp("resolved_at").defaultNow().notNull(),
});

export const insertSyncEventSchema = createInsertSchema(synchronicityEvents).omit({
  id: true,
  resolvedAt: true,
});

export type InsertSyncEvent = z.infer<typeof insertSyncEventSchema>;
export type SyncEvent = typeof synchronicityEvents.$inferSelect;