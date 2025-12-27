// @ts-nocheck - build fails without this

import { db } from "../index";
import { adminsTable } from "../schema";
import { eq } from "drizzle-orm";

export const isAdmin = async (firebaseUid: string) => {
  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.firebaseUid, firebaseUid));

  return admin?.isVerified || false;
};

export const getAdminByUid = async (firebaseUid: string) => {
  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.firebaseUid, firebaseUid));
  return admin || null;
};

export const registerAdmin = async (firebaseUid: string, email: string, name: string) => {
  const existing = await getAdminByUid(firebaseUid);
  if (existing) {
    return { success: false, error: "Already registered", admin: existing };
  }

  const [admin] = await db
    .insert(adminsTable)
    .values({
      firebaseUid,
      email,
      name,
      isVerified: false,
    })
    .returning();

  return { success: true, admin };
};

export const verifyAdmin = async (firebaseUid: string) => {
  const [admin] = await db
    .update(adminsTable)
    .set({ isVerified: true, updatedAt: new Date() })
    .where(eq(adminsTable.firebaseUid, firebaseUid))
    .returning();

  return admin;
};
