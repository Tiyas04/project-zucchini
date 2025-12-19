import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
  },
  schema,
});

export {
  usersTable,
  transactionsTable,
  adminsTable,
  razorpayPaymentsTable,
  genderEnum,
  paymentMethodEnum,
  munRegistrationsTable,
  munTransactionsTable,
  studentTypeEnum,
  munCommitteeEnum,
  bloodGroupEnum,
} from "./schema";

export type {
  User,
  NewUser,
  Transaction,
  NewTransaction,
  Admin,
  NewAdmin,
  RazorpayPayment,
  NewRazorpayPayment,
  MunRegistration,
  NewMunRegistration,
  MunTransaction,
  NewMunTransaction,
} from "./schema";

export { eq, and, or, not, sql, desc, asc } from "drizzle-orm";

export * from "./services";
