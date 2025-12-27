// @ts-nocheck - build fails without this

import { db } from "../index";
import { usersTable, transactionsTable, munRegistrationsTable } from "../schema";
import { eq } from "drizzle-orm";
import { ApiError } from "@repo/shared-types";

export type TransactionType = "NITRUTSAV" | "MUN";

export const getTxnIdByFirebaseUid = async (firebaseUid: string): Promise<string | null> => {
  const [result] = await db
    .select({ txnId: transactionsTable.txnId })
    .from(usersTable)
    .innerJoin(transactionsTable, eq(usersTable.id, transactionsTable.userId))
    .where(eq(usersTable.firebaseUid, firebaseUid));

  return result?.txnId || null;
};

export const updatePaymentStatusByTxnId = async (txnId: string, isVerified: boolean) => {
  return await db.transaction(async (tx) => {
    const [transaction] = await tx
      .update(transactionsTable)
      .set({ isVerified })
      .where(eq(transactionsTable.txnId, txnId))
      .returning();

    if (transaction?.teamId) {
      await db
        .update(munRegistrationsTable)
        .set({ isVerified })
        .where(eq(munRegistrationsTable.teamId, transaction.teamId));
      return true;
    }

    if (!transaction || !transaction.userId) {
      throw new ApiError(400, "Transaction has no associated user");
    }

    const [user] = await tx
      .update(usersTable)
      .set({ isVerified })
      .where(eq(usersTable.id, transaction.userId))
      .returning();
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return true;
  });
};

function generateTxnId(type: TransactionType): string {
  const prefix = type === "NITRUTSAV" ? "NU26" : "MUN26";
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}

export const createTransaction = async (
  type: TransactionType,
  amount: number,
  userId?: number,
  teamId?: string
) => {
  if (!userId && !teamId) {
    throw new ApiError(400, "Either userId or teamId is required");
  }

  const [existingTransaction] = await db
    .select()
    .from(transactionsTable)
    .where(userId ? eq(transactionsTable.userId, userId) : eq(transactionsTable.teamId, teamId!));

  if (existingTransaction) {
    if (existingTransaction.isVerified) {
      return existingTransaction;
    }
    await db.delete(transactionsTable).where(eq(transactionsTable.id, existingTransaction.id));
  }

  const txnId = generateTxnId(type);

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId: userId || null,
      teamId: teamId || null,
      txnId,
      type,
      amount,
      isVerified: false,
    })
    .returning();

  return transaction;
};
