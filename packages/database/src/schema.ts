import { integer, pgTable, varchar, timestamp, boolean, text, pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);
export const paymentMethodEnum = pgEnum("payment_method", ["qr", "razorpay"]);

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
  campusAmbassador: boolean().default(false),
  isVerified: boolean().notNull().default(false),
  hasPermission: boolean().notNull().default(true),
  hasAcceptedUndertaking: boolean().notNull().default(true),
  registeredAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const transactionsTable = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  paymentReceipt: text().notNull(),
  transactionId: varchar({ length: 255 }).notNull(),
  paymentMethod: paymentMethodEnum(),
  isVerified: boolean().notNull().default(false),
  verifiedAt: timestamp(),
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
