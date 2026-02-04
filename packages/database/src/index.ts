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
  genderEnum,
  transactionTypeEnum,
  munRegistrationsTable,
  studentTypeEnum,
  munCommitteeEnum,
  bloodGroupEnum,
  checkinsTable,
  regTypeEnum,
} from "./schema";

export type {
  User,
  NewUser,
  Transaction,
  NewTransaction,
  Admin,
  NewAdmin,
  MunRegistration,
  NewMunRegistration,
  Checkin,
  NewCheckin,
} from "./schema";

export { eq, and, or, not, sql, desc, asc } from "drizzle-orm";

export * from "./services";
