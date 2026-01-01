import { integer, pgTable, varchar, timestamp, boolean, text, pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["NITRUTSAV", "MUN"]);

export const studentTypeEnum = pgEnum("student_type", ["SCHOOL", "COLLEGE"]);
export const munCommitteeEnum = pgEnum("mun_committee", [
  "UNHRC",
  "UNGA_DISEC",
  "ECOSOC",
  "AIPPM",
  "IP_PHOTOGRAPHER",
  "IP_JOURNALIST",
  "UNSC_OVERNIGHT_CRISIS",
  "AIPPM_OVERNIGHT_CRISIS",
  "MOOT_COURT",
]);
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
  referralCode: varchar({ length: 10 }),
  referredBy: integer(),
  permission: text().notNull(),
  undertaking: text().notNull(),
  wantsAccommodation: boolean().notNull().default(true),
  isNitrStudent: boolean().notNull().default(false),
  isVerified: boolean().notNull().default(false),
  registeredAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const transactionsTable = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id, { onDelete: "cascade" }),
  teamId: varchar({ length: 10 }),
  txnId: varchar({ length: 50 }).notNull().unique(),
  type: transactionTypeEnum().notNull(),
  amount: integer().notNull(),
  isVerified: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const adminsTable = pgTable("admins", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firebaseUid: varchar({ length: 128 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }),
  isVerified: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Transaction = typeof transactionsTable.$inferSelect;
export type NewTransaction = typeof transactionsTable.$inferInsert;

export type Admin = typeof adminsTable.$inferSelect;
export type NewAdmin = typeof adminsTable.$inferInsert;

export const munRegistrationsTable = pgTable("mun_registrations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firebaseUid: varchar({ length: 128 }).unique(),

  teamId: varchar({ length: 10 }),
  isTeamLeader: boolean().default(false),

  name: varchar({ length: 255 }).notNull(),
  gender: genderEnum().notNull(),
  dateOfBirth: timestamp().notNull(),
  phone: varchar({ length: 10 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),

  studentType: studentTypeEnum().notNull(),
  institute: varchar({ length: 255 }).notNull(),
  university: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 100 }).notNull(),
  state: varchar({ length: 100 }).notNull(),
  rollNumber: varchar({ length: 100 }).notNull(),
  idCard: text().notNull(),

  committeeChoice: munCommitteeEnum().notNull(),
  hasParticipatedBefore: boolean().notNull(),

  emergencyContactName: varchar({ length: 255 }).notNull(),
  emergencyContactPhone: varchar({ length: 10 }).notNull(),
  bloodGroup: bloodGroupEnum(),

  agreedToTerms: boolean().notNull(),

  countsAsNitrutsavRegistration: boolean().notNull().default(true),

  isNitrStudent: boolean().notNull().default(false),
  isVerified: boolean().notNull().default(false),
  registeredAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export type MunRegistration = typeof munRegistrationsTable.$inferSelect;
export type NewMunRegistration = typeof munRegistrationsTable.$inferInsert;
