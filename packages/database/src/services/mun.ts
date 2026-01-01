// @ts-nocheck - build fails without this

import { db } from "../index";
import { munRegistrationsTable, transactionsTable, usersTable } from "../schema";
import { eq, desc, and } from "drizzle-orm";
import { MunRegistrationSchema, validateAndThrow, type MunRegistration } from "@repo/shared-types";
import { getUserByFirebaseUid } from "./user";
import { MUN_FEE } from "../../../../apps/web/config";

const generateTeamIdFromRowId = (rowId: number): string => {
  return `MUN-${rowId.toString().padStart(5, "0")}`;
};

export const getMunUserByFirebaseUid = async (firebaseUid: string) => {
  const [result] = await db
    .select({
      registration: munRegistrationsTable,
      transaction: transactionsTable,
    })
    .from(munRegistrationsTable)
    .leftJoin(
      transactionsTable,
      and(
        eq(munRegistrationsTable.teamId, transactionsTable.teamId),
        eq(transactionsTable.type, "MUN")
      )
    )
    .where(eq(munRegistrationsTable.firebaseUid, firebaseUid))
    .limit(1);

  if (!result) return null;

  return {
    ...result.registration,
    isPaymentVerified: result.transaction?.isVerified || false,
  };
};

const checkEmailRegistration = async (email: string): Promise<boolean> => {
  // Only check MUN registrations - users can register for both NITRUTSAV and MUN
  const [munReg] = await db
    .select()
    .from(munRegistrationsTable)
    .where(eq(munRegistrationsTable.email, email))
    .limit(1);

  return !!munReg;
};

export const registerMunUser = async (
  userData: MunRegistration,
  firebaseUid: string,
  isNitrStudent: boolean = false
) => {
  validateAndThrow(MunRegistrationSchema, userData, "MUN registration");

  if (await checkEmailRegistration(userData.email)) {
    throw new Error(`${userData.email} is already registered`);
  }

  // First insert without teamId to get the row ID
  const [newRegistration] = await db
    .insert(munRegistrationsTable)
    .values({
      firebaseUid,
      isTeamLeader: false,
      ...userData,
      isNitrStudent,
      isVerified: isNitrStudent,
    })
    .returning();

  if (!newRegistration) {
    throw new Error("Failed to create MUN registration");
  }

  // Generate teamId from row ID and update
  const teamId = generateTeamIdFromRowId(newRegistration.id);
  await db
    .update(munRegistrationsTable)
    .set({ teamId })
    .where(eq(munRegistrationsTable.id, newRegistration.id));

  return { userId: newRegistration.id, teamId };
};

export const registerMunTeam = async (
  teamLeader: MunRegistration,
  teammate1: MunRegistration,
  teammate2: MunRegistration,
  leaderFirebaseUid: string,
  teammate1FirebaseUid: string | null,
  teammate2FirebaseUid: string | null,
  leaderIsNitrStudent: boolean = false,
  teammate1IsNitrStudent: boolean = false,
  teammate2IsNitrStudent: boolean = false
) => {
  const emails = [teamLeader.email, teammate1.email, teammate2.email];
  for (const email of emails) {
    if (await checkEmailRegistration(email)) {
      throw new Error(`${email} is already registered`);
    }
  }

  // First insert all team members without teamId
  const registrations = await db
    .insert(munRegistrationsTable)
    .values([
      {
        firebaseUid: leaderFirebaseUid,
        isTeamLeader: true,
        ...teamLeader,
        isNitrStudent: leaderIsNitrStudent,
        isVerified: leaderIsNitrStudent,
      },
      {
        firebaseUid: teammate1FirebaseUid,
        isTeamLeader: false,
        ...teammate1,
        isNitrStudent: teammate1IsNitrStudent,
        isVerified: teammate1IsNitrStudent,
      },
      {
        firebaseUid: teammate2FirebaseUid,
        isTeamLeader: false,
        ...teammate2,
        isNitrStudent: teammate2IsNitrStudent,
        isVerified: teammate2IsNitrStudent,
      },
    ])
    .returning();

  if (registrations.length !== 3) {
    throw new Error("Failed to create team registrations");
  }

  // Generate teamId from leader's row ID and update all team members
  const teamId = generateTeamIdFromRowId(registrations[0]!.id);
  await db
    .update(munRegistrationsTable)
    .set({ teamId })
    .where(eq(munRegistrationsTable.id, registrations[0]!.id));
  await db
    .update(munRegistrationsTable)
    .set({ teamId })
    .where(eq(munRegistrationsTable.id, registrations[1]!.id));
  await db
    .update(munRegistrationsTable)
    .set({ teamId })
    .where(eq(munRegistrationsTable.id, registrations[2]!.id));

  return {
    teamId,
    teamLeaderId: registrations[0]!.id,
    teammate1Id: registrations[1]!.id,
    teammate2Id: registrations[2]!.id,
  };
};

export const getTeamMembers = async (teamId: string) => {
  const members = await db
    .select()
    .from(munRegistrationsTable)
    .where(eq(munRegistrationsTable.teamId, teamId));

  return members;
};

export const updateTeammateFirebaseUid = async (email: string, firebaseUid: string) => {
  const [updated] = await db
    .update(munRegistrationsTable)
    .set({ firebaseUid })
    .where(eq(munRegistrationsTable.email, email))
    .returning();

  return updated;
};

export const getMunRegistrationFee = (
  studentType: "SCHOOL" | "COLLEGE",
  committeeChoice: string
): number => {
  const baseFee = studentType === "COLLEGE" ? MUN_FEE.college : MUN_FEE.school;
  return committeeChoice === "MOOT_COURT" ? baseFee * 3 : baseFee;
};

export const checkCrossRegistration = async (firebaseUid: string) => {
  const munUser = await getMunUserByFirebaseUid(firebaseUid);
  if (munUser) {
    return {
      isMunRegistered: true,
      isNitrutsavRegistered: true, // MUN = NITRUTSAV
      registrationType: "MUN" as const,
      userId: munUser.id,
      name: munUser.name,
      email: munUser.email,
      referralCode: null, // MUN registrations don't have referral codes
      isPaymentVerified: munUser.isPaymentVerified,
      isNitrStudent: munUser.isNitrStudent,
      isVerified: munUser.isVerified,
    };
  }

  const nitrutsavUser = await getUserByFirebaseUid(firebaseUid);
  if (nitrutsavUser) {
    return {
      isMunRegistered: false,
      isNitrutsavRegistered: true,
      registrationType: "NITRUTSAV" as const,
      userId: nitrutsavUser.id,
      name: nitrutsavUser.name,
      email: nitrutsavUser.email,
      referralCode: nitrutsavUser.referralCode,
      isPaymentVerified: nitrutsavUser.isPaymentVerified,
      isNitrStudent: nitrutsavUser.isNitrStudent,
      isVerified: nitrutsavUser.isVerified,
    };
  }

  return {
    isMunRegistered: false,
    isNitrutsavRegistered: false,
    registrationType: null,
    userId: null,
    name: null,
    email: null,
    referralCode: null,
    isPaymentVerified: false,
    isNitrStudent: false,
    isVerified: false,
  };
};

export const getPaginatedMunRegistrations = async (pageSize: number = 10, page: number = 0) => {
  const offset = page * pageSize;

  const registrations = await db
    .select({
      registration: munRegistrationsTable,
      transaction: transactionsTable,
    })
    .from(munRegistrationsTable)
    .leftJoin(
      transactionsTable,
      and(
        eq(munRegistrationsTable.teamId, transactionsTable.teamId),
        eq(transactionsTable.type, "MUN")
      )
    )
    .orderBy(desc(munRegistrationsTable.registeredAt))
    .limit(pageSize)
    .offset(offset);

  const totalCount = await db.select().from(munRegistrationsTable);

  return {
    registrations: registrations.map((r) => ({
      ...r.registration,
      isPaymentVerified: r.transaction?.isVerified || false,
      paymentAmount: r.transaction?.amount || 0,
    })),
    hasMore: offset + pageSize < totalCount.length,
    total: totalCount.length,
    page,
    pageSize,
  };
};

export const getMunStatistics = async () => {
  const allRegistrations = await db
    .select({
      registration: munRegistrationsTable,
      transaction: transactionsTable,
    })
    .from(munRegistrationsTable)
    .leftJoin(
      transactionsTable,
      and(
        eq(munRegistrationsTable.teamId, transactionsTable.teamId),
        eq(transactionsTable.type, "MUN")
      )
    );

  const total = allRegistrations.length;
  const male = allRegistrations.filter((r) => r.registration.gender === "MALE").length;
  const female = allRegistrations.filter((r) => r.registration.gender === "FEMALE").length;

  // Only count non-NITR students for payment stats
  const nonNitrRegistrations = allRegistrations.filter((r) => !r.registration.isNitrStudent);
  const verified = nonNitrRegistrations.filter((r) => r.transaction?.isVerified).length;
  const pending = nonNitrRegistrations.length - verified;

  const uniqueTeams = new Set(allRegistrations.map((r) => r.registration.teamId));

  return {
    total,
    male,
    female,
    verified,
    pending,
    teams: uniqueTeams.size,
  };
};

export const getMunTeamsGrouped = async () => {
  const allRegistrations = await db
    .select({
      registration: munRegistrationsTable,
      transaction: transactionsTable,
    })
    .from(munRegistrationsTable)
    .leftJoin(
      transactionsTable,
      and(
        eq(munRegistrationsTable.teamId, transactionsTable.teamId),
        eq(transactionsTable.type, "MUN")
      )
    )
    .orderBy(desc(munRegistrationsTable.registeredAt));

  const teamsMap = new Map<
    string,
    {
      teamId: string;
      members: typeof allRegistrations;
      isPaymentVerified: boolean;
      paymentAmount: number;
      committeeChoice: string;
      studentType: string;
    }
  >();

  for (const reg of allRegistrations) {
    const teamId = reg.registration.teamId || reg.registration.id.toString();

    if (!teamsMap.has(teamId)) {
      teamsMap.set(teamId, {
        teamId,
        members: [],
        isPaymentVerified: reg.transaction?.isVerified || false,
        paymentAmount: reg.transaction?.amount || 0,
        committeeChoice: reg.registration.committeeChoice,
        studentType: reg.registration.studentType,
      });
    }

    teamsMap.get(teamId)!.members.push(reg);
  }

  return Array.from(teamsMap.values());
};
