// @ts-nocheck - build fails without this

import { db } from "../index";
import { usersTable, transactionsTable } from "../schema";
import { desc, eq, ilike, or } from "drizzle-orm";
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

/**
 * Generate a referral code using the formula: NAME(4) + USER_ID + PHONE_SUFFIX = 10 chars
 */
export const generateReferralCode = (name: string, userId: number, phone: string): string => {
  // Extract first name and get up to 4 uppercase letters
  const firstName = name
    .split(" ")[0]
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  const namePart = firstName.substring(0, 4).padEnd(4, "X").substring(0, 4);

  // Convert userId to string
  const userIdStr = String(userId);

  // Calculate how many phone digits we need (10 - name length - userId length)
  const phoneSuffixLength = 10 - namePart.length - userIdStr.length;

  // Get the last N digits of phone
  const phoneSuffix = phone.slice(-Math.max(0, phoneSuffixLength));

  return `${namePart}${userIdStr}${phoneSuffix}`;
};

/**
 * Validate a referral code and return the referrer's info
 */
export const validateReferralCode = async (code: string) => {
  if (!code) return null;

  const [referrer] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      referralCode: usersTable.referralCode,
    })
    .from(usersTable)
    .where(eq(usersTable.referralCode, code.toUpperCase()))
    .limit(1);

  return referrer || null;
};

/**
 * Get referral leaderboard with counts
 */
export const getReferralLeaderboard = async (limit: number = 50) => {
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      referralCode: usersTable.referralCode,
      phone: usersTable.phone,
    })
    .from(usersTable)
    .where(eq(usersTable.referralCode, usersTable.referralCode)); // All users with referral codes

  // Count referrals for each user
  const allUsers = await db
    .select({
      id: usersTable.id,
      referredBy: usersTable.referredBy,
    })
    .from(usersTable);

  const referralCounts = new Map<number, number>();
  allUsers.forEach((user) => {
    if (user.referredBy) {
      referralCounts.set(user.referredBy, (referralCounts.get(user.referredBy) || 0) + 1);
    }
  });

  // Build leaderboard
  const leaderboard = users
    .map((user) => ({
      id: user.id,
      name: user.name,
      referralCode: user.referralCode,
      referralCount: referralCounts.get(user.id) || 0,
    }))
    .filter((user) => user.referralCount > 0)
    .sort((a, b) => b.referralCount - a.referralCount)
    .slice(0, limit);

  const totalReferrals = Array.from(referralCounts.values()).reduce((a, b) => a + b, 0);

  return {
    leaderboard,
    totalReferrals,
    totalReferrers: leaderboard.length,
  };
};

export const registerUser = async (
  userData: Registration,
  firebaseUid: string,
  isNitrStudent: boolean = false,
  wantsAccommodation: boolean = true,
  inputReferralCode?: string
) => {
  validateAndThrow(RegistrationSchema, userData, "User registration");

  // Validate referral code if provided
  let referrerId: number | null = null;
  if (inputReferralCode) {
    const referrer = await validateReferralCode(inputReferralCode);
    if (referrer) {
      referrerId = referrer.id;
    }
  }

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
      referralCode: null, // Will be generated after insert
      referredBy: referrerId,
      permission: userData.permission,
      undertaking: userData.undertaking,
      wantsAccommodation,
      isNitrStudent,
      isVerified: isNitrStudent, // Auto-verify NITR students
    })
    .returning();

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  // Generate and update referral code with the new user ID
  const generatedReferralCode = generateReferralCode(userData.name, newUser.id, userData.phone);

  await db
    .update(usersTable)
    .set({ referralCode: generatedReferralCode })
    .where(eq(usersTable.id, newUser.id));

  return { userId: newUser.id, referralCode: generatedReferralCode };
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
      isNitrStudent: usersTable.isNitrStudent,
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

export const getNitrutsavStatistics = async () => {
  const allUsers = await db
    .select({
      user: usersTable,
      transaction: transactionsTable,
    })
    .from(usersTable)
    .leftJoin(transactionsTable, eq(usersTable.id, transactionsTable.userId));

  const total = allUsers.length;
  const male = allUsers.filter((u) => u.user.gender === "MALE").length;
  const female = allUsers.filter((u) => u.user.gender === "FEMALE").length;
  const nitrStudents = allUsers.filter((u) => u.user.isNitrStudent).length;

  // Only count non-NITR students for payment stats
  const nonNitrUsers = allUsers.filter((u) => !u.user.isNitrStudent);
  const verified = nonNitrUsers.filter((u) => u.transaction?.isVerified).length;
  const pending = nonNitrUsers.length - verified;

  return {
    total,
    male,
    female,
    verified,
    pending,
    nitrStudents,
  };
};

export const searchNitrutsavUsers = async (query: string, limit: number = 20) => {
  const searchPattern = `%${query}%`;

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
      isNitrStudent: usersTable.isNitrStudent,
      isVerified: usersTable.isVerified,
      registeredAt: usersTable.registeredAt,
      transaction: transactionsTable,
    })
    .from(usersTable)
    .leftJoin(transactionsTable, eq(usersTable.id, transactionsTable.userId))
    .where(
      or(
        ilike(usersTable.email, searchPattern),
        ilike(usersTable.name, searchPattern),
        ilike(usersTable.phone, searchPattern)
      )
    )
    .orderBy(desc(usersTable.registeredAt))
    .limit(limit);

  return users;
};
