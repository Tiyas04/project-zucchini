import { db } from "../index";
import { usersTable, transactionsTable } from "../schema";
import { desc, eq } from "drizzle-orm";
import { type Registration, RegistrationSchema, validateAndThrow } from "@repo/shared-types";

export const getUserByFirebaseUid = async (firebaseUid: string) => {
  const [result] = await db
    .select({
      user: usersTable,
      transaction: transactionsTable,
    })
    .from(usersTable)
    .leftJoin(transactionsTable, eq(usersTable.id, transactionsTable.userId))
    .where(eq(usersTable.firebaseUid, firebaseUid))
    .limit(1);

  if (!result) {
    return null;
  }

  return {
    ...result.user,
    isPaymentVerified: result.transaction?.isVerified || false,
  };
};

export const registerUser = async (userData: Registration, firebaseUid: string) => {
  validateAndThrow(RegistrationSchema, userData, "User registration");

  const [newUser] = await db
    .insert(usersTable)
    .values({
      firebaseUid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      institute: userData.institute,
      university: userData.university,
      rollNumber: userData.rollNumber,
      idCard: userData.idCard,
      referralCode: userData.referralCode || null,
      permission: userData.permission,
      undertaking: userData.undertaking,
    })
    .returning();

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  return { userId: newUser.id };
};

export const getPaginatedUsers = async (pageSize: number = 10, page: number = 0) => {
  const offset = page * pageSize;

  const users = await db
    .select({
      id: usersTable.id,
      firebaseUid: usersTable.firebaseUid,
      name: usersTable.name,
      email: usersTable.email,
      phone: usersTable.phone,
      gender: usersTable.gender,
      institute: usersTable.institute,
      university: usersTable.university,
      rollNumber: usersTable.rollNumber,
      idCard: usersTable.idCard,
      referralCode: usersTable.referralCode,
      isVerified: usersTable.isVerified,
      registeredAt: usersTable.registeredAt,
      transaction: transactionsTable,
    })
    .from(usersTable)
    .leftJoin(transactionsTable, eq(usersTable.id, transactionsTable.userId))
    .orderBy(desc(usersTable.registeredAt))
    .limit(pageSize)
    .offset(offset);

  const totalCount = await db.select().from(usersTable);

  return {
    users,
    hasMore: offset + pageSize < totalCount.length,
    total: totalCount.length,
    page,
    pageSize,
  };
};
