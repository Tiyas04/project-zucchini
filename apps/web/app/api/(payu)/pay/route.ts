import { NextRequest } from "next/server";
import { createHash } from "crypto";
import { handleResponse, requireAuth } from "@repo/shared-utils/server";
import { createTransaction, getUserByFirebaseUid } from "@repo/database";
import { handleError } from "@repo/shared-types";
import { MUN_FEE, NITRUTSAV_FEE } from "@/config";

interface PaymentParams {
  key?: string;
  txnid?: string;
  amount?: string;
  productinfo?: string;
  firstname?: string;
  email?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

function generateHash(params: PaymentParams, salt: string): string {
  const key = params.key;
  const txnid = params.txnid;
  const amount = params.amount;
  const productinfo = params.productinfo;
  const firstname = params.firstname;
  const email = params.email;
  const udf1 = params.udf1 || "";
  const udf2 = params.udf2 || "";
  const udf3 = params.udf3 || "";
  const udf4 = params.udf4 || "";
  const udf5 = params.udf5 || "";

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

  return createHash("sha512").update(hashString).digest("hex");
}

function calculateAmount(
  type: "NITRUTSAV" | "MUN",
  isCollegeStudent: boolean,
  committeeChoice?: string
) {
  if (type === "NITRUTSAV") {
    return NITRUTSAV_FEE;
  } else {
    const baseFee = isCollegeStudent ? MUN_FEE.college : MUN_FEE.school;
    return committeeChoice === "MOOT_COURT" ? baseFee * 3 : baseFee;
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    const userFirebaseId = auth.uid;

    const {
      name,
      email,
      type = "NITRUTSAV",
      teamId,
      isCollegeStudent = true,
      committeeChoice,
    } = await req.json();
    let userId: number | undefined;

    // Only fetch user for NITRUTSAV type
    if (type === "NITRUTSAV") {
      const user = await getUserByFirebaseUid(userFirebaseId);

      if (!user) {
        return handleError(new Error("User not found"));
      }
      userId = user.id;
    }

    const amount = calculateAmount(type, isCollegeStudent, committeeChoice);

    const transaction = await createTransaction(
      type,
      amount,
      userId,
      type === "MUN" ? teamId : undefined
    );

    if (!transaction) {
      return handleError(new Error("Transaction not found"));
    }

    if (transaction.isVerified) {
      return handleError(new Error("Payment completed already!"));
    }

    const origin = req.nextUrl.origin;
    const options = {
      key: process.env.PAYU_KEY!,
      txnid: transaction.txnId,
      amount: String(amount) + ".00",
      productinfo: `Registration fees for ${type === "MUN" ? "MUN 2026" : "Nitrutsav 26"}`,
      firstname: name,
      email,
      surl: `${origin}/api/callback`,
      furl: `${origin}/api/callback`,
      udf1: `Registration fees for ${type === "MUN" ? "MUN 2026" : "Nitrutsav 26"}`,
    };

    const salt = process.env.PAYU_SALT;
    if (!salt) return handleError(new Error("salt not found!"));
    const hash = generateHash(options, salt);

    return handleResponse({
      ...options,
      hash,
      url: process.env.PAYMENT_URL,
    });
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
}
