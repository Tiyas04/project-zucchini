import { db } from "../index";
import { munRegistrationsTable, munTransactionsTable, usersTable } from "../schema";
import { eq } from "drizzle-orm";
import { MunRegistrationSchema, validateAndThrow, type MunRegistration } from "@repo/shared-types";
import { getUserByFirebaseUid } from "./user";

export const getMunUserByFirebaseUid = async (firebaseUid: string) => {
  const [result] = await db
    .select({
      registration: munRegistrationsTable,
      transaction: munTransactionsTable,
    })
    .from(munRegistrationsTable)
    .leftJoin(
      munTransactionsTable,
      eq(munRegistrationsTable.id, munTransactionsTable.munRegistrationId)
    )
    .where(eq(munRegistrationsTable.firebaseUid, firebaseUid))
    .limit(1);

  if (!result) return null;

  return {
    ...result.registration,
    isPaymentVerified: result.transaction?.isVerified || false,
  };
};

export const registerMunUser = async (userData: MunRegistration, firebaseUid: string) => {
  validateAndThrow(MunRegistrationSchema, userData, "MUN registration");

  const [newRegistration] = await db
    .insert(munRegistrationsTable)
    .values({
      firebaseUid,
      ...userData,
    })
    .returning();

  if (!newRegistration) {
    throw new Error("Failed to create MUN registration");
  }

  return { userId: newRegistration.id };
};

// Calculate registration fee based on student type and committee
export const getMunRegistrationFee = (
  studentType: "SCHOOL" | "COLLEGE",
  committeeChoice: string
): number => {
  const baseFee = studentType === "COLLEGE" ? 1500 : 1200;
  // MOOT Court requires 3 people, so triple the cost
  return committeeChoice === "MOOT_COURT" ? baseFee * 3 : baseFee;
};

// Check if user is already registered for NITRUTSAV or MUN
export const checkCrossRegistration = async (firebaseUid: string) => {
  // Check MUN registration
  const munUser = await getMunUserByFirebaseUid(firebaseUid);
  if (munUser) {
    return {
      isMunRegistered: true,
      isNitrutsavRegistered: true, // MUN = NITRUTSAV
      registrationType: "MUN" as const,
      userId: munUser.id,
      name: munUser.name,
      email: munUser.email,
      isPaymentVerified: munUser.isPaymentVerified,
    };
  }

  // Check NITRUTSAV registration
  const nitrutsavUser = await getUserByFirebaseUid(firebaseUid);
  if (nitrutsavUser) {
    return {
      isMunRegistered: false,
      isNitrutsavRegistered: true,
      registrationType: "NITRUTSAV" as const,
      userId: nitrutsavUser.id,
      name: nitrutsavUser.name,
      email: nitrutsavUser.email,
      isPaymentVerified: nitrutsavUser.isPaymentVerified,
    };
  }

  return {
    isMunRegistered: false,
    isNitrutsavRegistered: false,
    registrationType: null,
    userId: null,
    name: null,
    email: null,
    isPaymentVerified: false,
  };
};
