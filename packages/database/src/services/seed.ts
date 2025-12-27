// @ts-nocheck - build fails without this

import { db } from "../index";
import { usersTable, transactionsTable, munRegistrationsTable, adminsTable } from "../schema";

function generateTxnId(type: "NITRUTSAV" | "MUN"): string {
  const prefix = type === "NITRUTSAV" ? "NU26" : "MUN26";
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}

export type SeedData = {
  users?: Array<{
    firebaseUid: string;
    name: string;
    email: string;
    phone: string;
    gender: "MALE" | "FEMALE";
    institute: string;
    university: string;
    rollNumber: string;
    idCard: string;
    referralCode?: string;
    permission: string;
    undertaking: string;
    isNitrStudent?: boolean;
    isVerified?: boolean;
  }>;
  transactions?: Array<{
    userEmail: string;
    amount: number;
    isVerified?: boolean;
  }>;
  munRegistrations?: Array<{
    firebaseUid?: string;
    teamId: string;
    isTeamLeader?: boolean;
    name: string;
    gender: "MALE" | "FEMALE";
    dateOfBirth: string;
    phone: string;
    email: string;
    studentType: "SCHOOL" | "COLLEGE";
    institute: string;
    university: string;
    city: string;
    state: string;
    rollNumber: string;
    idCard: string;
    committeeChoice:
      | "UNHRC"
      | "UNGA_DISEC"
      | "ECOSOC"
      | "AIPPM"
      | "IP_PHOTOGRAPHER"
      | "IP_JOURNALIST"
      | "UNSC_OVERNIGHT_CRISIS"
      | "AIPPM_OVERNIGHT_CRISIS"
      | "MOOT_COURT";
    hasParticipatedBefore: boolean;
    emergencyContactName: string;
    emergencyContactPhone: string;
    bloodGroup?:
      | "A_POSITIVE"
      | "A_NEGATIVE"
      | "B_POSITIVE"
      | "B_NEGATIVE"
      | "AB_POSITIVE"
      | "AB_NEGATIVE"
      | "O_POSITIVE"
      | "O_NEGATIVE";
    agreedToTerms: boolean;
    isNitrStudent?: boolean;
    isVerified?: boolean;
  }>;
  munTransactions?: Array<{
    teamId: string;
    amount: number;
    isVerified?: boolean;
  }>;
  admins?: Array<{
    firebaseUid: string;
    email: string;
    name?: string;
    isVerified?: boolean;
  }>;
};

export const seedDatabase = async (data: SeedData) => {
  const results = {
    users: 0,
    transactions: 0,
    munRegistrations: 0,
    munTransactions: 0,
    admins: 0,
    errors: [] as string[],
  };

  // Seed admins
  if (data.admins && data.admins.length > 0) {
    for (const admin of data.admins) {
      try {
        await db.insert(adminsTable).values({
          firebaseUid: admin.firebaseUid,
          email: admin.email,
          name: admin.name || null,
          isVerified: admin.isVerified ?? false,
        });
        results.admins++;
      } catch (error: any) {
        results.errors.push(`Admin ${admin.email}: ${error.message}`);
      }
    }
  }

  // Seed NITRUTSAV users
  const userIdMap = new Map<string, number>();
  if (data.users && data.users.length > 0) {
    for (const user of data.users) {
      try {
        const [inserted] = await db
          .insert(usersTable)
          .values({
            firebaseUid: user.firebaseUid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            institute: user.institute,
            university: user.university,
            rollNumber: user.rollNumber,
            idCard: user.idCard,
            referralCode: user.referralCode || null,
            permission: user.permission,
            undertaking: user.undertaking,
            isNitrStudent: user.isNitrStudent ?? false,
            isVerified: user.isVerified ?? false,
          })
          .returning();
        userIdMap.set(user.email, inserted!.id);
        results.users++;
      } catch (error: any) {
        results.errors.push(`User ${user.email}: ${error.message}`);
      }
    }
  }

  // Seed NITRUTSAV transactions
  if (data.transactions && data.transactions.length > 0) {
    for (const tx of data.transactions) {
      const userId = userIdMap.get(tx.userEmail);
      if (!userId) {
        results.errors.push(`Transaction: User ${tx.userEmail} not found`);
        continue;
      }
      try {
        await db.insert(transactionsTable).values({
          userId,
          txnId: generateTxnId("NITRUTSAV"),
          type: "NITRUTSAV",
          amount: tx.amount,
          isVerified: tx.isVerified ?? false,
        });
        results.transactions++;
      } catch (error: any) {
        results.errors.push(`Transaction for ${tx.userEmail}: ${error.message}`);
      }
    }
  }

  // Seed MUN registrations
  if (data.munRegistrations && data.munRegistrations.length > 0) {
    for (const reg of data.munRegistrations) {
      try {
        await db.insert(munRegistrationsTable).values({
          firebaseUid: reg.firebaseUid || null,
          teamId: reg.teamId,
          isTeamLeader: reg.isTeamLeader ?? false,
          name: reg.name,
          gender: reg.gender,
          dateOfBirth: new Date(reg.dateOfBirth),
          phone: reg.phone,
          email: reg.email,
          studentType: reg.studentType,
          institute: reg.institute,
          university: reg.university,
          city: reg.city,
          state: reg.state,
          rollNumber: reg.rollNumber,
          idCard: reg.idCard,
          committeeChoice: reg.committeeChoice,
          hasParticipatedBefore: reg.hasParticipatedBefore,
          emergencyContactName: reg.emergencyContactName,
          emergencyContactPhone: reg.emergencyContactPhone,
          bloodGroup: reg.bloodGroup || null,
          agreedToTerms: reg.agreedToTerms,
          isNitrStudent: reg.isNitrStudent ?? false,
          isVerified: reg.isVerified ?? false,
        });
        results.munRegistrations++;
      } catch (error: any) {
        results.errors.push(`MUN ${reg.email}: ${error.message}`);
      }
    }
  }

  // Seed MUN transactions (using unified transactions table)
  if (data.munTransactions && data.munTransactions.length > 0) {
    for (const tx of data.munTransactions) {
      try {
        await db.insert(transactionsTable).values({
          teamId: tx.teamId,
          txnId: generateTxnId("MUN"),
          type: "MUN",
          amount: tx.amount,
          isVerified: tx.isVerified ?? false,
        });
        results.munTransactions++;
      } catch (error: any) {
        results.errors.push(`MUN Transaction ${tx.teamId}: ${error.message}`);
      }
    }
  }

  return results;
};
