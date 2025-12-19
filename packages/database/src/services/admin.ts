import { db } from "../index";
import { adminsTable } from "../schema";
import { eq } from "drizzle-orm";
export const isAdmin = async (email: string) => {
  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.email, email));

  return !!admin;
};
