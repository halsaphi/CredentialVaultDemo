import { pgTable, text, serial, integer, boolean, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Override the date type to use strings in the app for easier handling
// This is a workaround for the type issues between drizzle-orm and our app
type DateToString<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  credentialId: text("credential_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  dob: date("dob").notNull(),
  nationality: text("nationality").notNull(),
  idNumber: text("id_number").notNull(),
  kycStatus: text("kyc_status").notNull(),
  netWorth: integer("net_worth").notNull(),
  languages: text("languages").array().notNull(),
  additionalInfo: text("additional_info"),
  issueDate: date("issue_date").notNull(),
  revoked: boolean("revoked").default(false).notNull(),
  revocationDate: date("revocation_date"),
  revocationReason: text("revocation_reason"),
});

export const insertCredentialSchema = createInsertSchema(credentials).omit({
  id: true,
  revoked: true,
  revocationDate: true,
  revocationReason: true,
});

export type InsertCredential = z.infer<typeof insertCredentialSchema>;
// Use DateToString to convert Date types to string types for easier handling in the app
export type Credential = DateToString<typeof credentials.$inferSelect>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
