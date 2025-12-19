import { integer, pgTable, varchar, timestamp, boolean, text, pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);
export const paymentMethodEnum = pgEnum("payment_method", ["qr", "razorpay"]);

// MUN-specific enums
export const studentTypeEnum = pgEnum("student_type", ["SCHOOL", "COLLEGE"]);
export const munCommitteeEnum = pgEnum("mun_committee", ["OVERNIGHT_CRISIS", "MOOT_COURT"]);
export const bloodGroupEnum = pgEnum("blood_group", [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firebaseUid: varchar({ length: 128 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: varchar({ length: 10 }).notNull(),
  gender: genderEnum().notNull(),
  institute: varchar({ length: 255 }).notNull(),
  university: varchar({ length: 255 }).notNull(),
  rollNumber: varchar({ length: 100 }).notNull(),
  idCard: text().notNull(),
  referralCode: varchar({ length: 50 }),
  permission: text().notNull(),
  undertaking: text().notNull(),
  isVerified: boolean().notNull().default(false),
  registeredAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const transactionsTable = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  transactionId: varchar({ length: 255 }).notNull(),
  paymentMethod: paymentMethodEnum(),
  isVerified: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const adminsTable = pgTable("admins", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const razorpayPaymentsTable = pgTable("razorpay_payments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  transactionId: integer()
    .notNull()
    .unique()
    .references(() => transactionsTable.id, { onDelete: "cascade" }),
  orderId: varchar({ length: 255 }).notNull(),
  paymentId: varchar({ length: 255 }).notNull().unique(),
  signature: varchar({ length: 255 }).notNull(),
  isVerified: boolean().notNull().default(false),
  verifiedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Transaction = typeof transactionsTable.$inferSelect;
export type NewTransaction = typeof transactionsTable.$inferInsert;

export type Admin = typeof adminsTable.$inferSelect;
export type NewAdmin = typeof adminsTable.$inferInsert;

export type RazorpayPayment = typeof razorpayPaymentsTable.$inferSelect;
export type NewRazorpayPayment = typeof razorpayPaymentsTable.$inferInsert;

// MUN Registration Tables
export const munRegistrationsTable = pgTable("mun_registrations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firebaseUid: varchar({ length: 128 }).notNull().unique(),

  // Basic Information
  name: varchar({ length: 255 }).notNull(),
  gender: genderEnum().notNull(),
  dateOfBirth: timestamp().notNull(),
  phone: varchar({ length: 10 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),

  // College/Institute Details
  studentType: studentTypeEnum().notNull(),
  institute: varchar({ length: 255 }).notNull(),
  university: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 100 }).notNull(),
  state: varchar({ length: 100 }).notNull(),
  rollNumber: varchar({ length: 100 }).notNull(),
  idCard: text().notNull(),

  // MUN Specific
  committeeChoice: munCommitteeEnum().notNull(),
  hasParticipatedBefore: boolean().notNull(),

  // Team Information (for MOOT Court - Option A: Leader registers team)
  isTeamLeader: boolean().default(false),
  teammate1Name: varchar({ length: 255 }),
  teammate1Email: varchar({ length: 255 }),
  teammate1Phone: varchar({ length: 10 }),
  teammate2Name: varchar({ length: 255 }),
  teammate2Email: varchar({ length: 255 }),
  teammate2Phone: varchar({ length: 10 }),

  // Emergency & Safety
  emergencyContactName: varchar({ length: 255 }).notNull(),
  emergencyContactPhone: varchar({ length: 10 }).notNull(),
  bloodGroup: bloodGroupEnum(),

  // Declaration
  agreedToTerms: boolean().notNull(),

  // Cross-Registration Tracking
  // MUN registration counts as NITRUTSAV registration
  countsAsNitrutsavRegistration: boolean().notNull().default(true),

  // Status
  isVerified: boolean().notNull().default(false),
  registeredAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const munTransactionsTable = pgTable("mun_transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  munRegistrationId: integer()
    .notNull()
    .unique()
    .references(() => munRegistrationsTable.id, { onDelete: "cascade" }),
  transactionId: varchar({ length: 255 }).notNull(),
  amount: integer().notNull(), // Base: 1500 (college) or 1200 (school), tripled for MOOT Court teams
  paymentMethod: paymentMethodEnum(),
  paymentScreenshot: text(),
  isVerified: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export type MunRegistration = typeof munRegistrationsTable.$inferSelect;
export type NewMunRegistration = typeof munRegistrationsTable.$inferInsert;

export type MunTransaction = typeof munTransactionsTable.$inferSelect;
export type NewMunTransaction = typeof munTransactionsTable.$inferInsert;
