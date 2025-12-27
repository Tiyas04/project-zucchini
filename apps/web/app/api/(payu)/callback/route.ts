import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function verifyPayuHash(params: Record<string, string>, salt: string): boolean {
  const receivedHash = params.hash;

  const hashString = `${salt}|${params.status}||||||${params.udf5 || ""}|${params.udf4 || ""}|${params.udf3 || ""}|${params.udf2 || ""}|${params.udf1 || ""}|${params.email}|${params.firstname}|${params.productinfo}|${params.amount}|${params.txnid}|${params.key}`;

  const calculatedHash = createHash("sha512").update(hashString).digest("hex");

  return receivedHash === calculatedHash;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const salt = process.env.PAYU_SALT;
    if (!salt) {
      return NextResponse.redirect(new URL("/failure?error=config", req.url));
    }

    const isHashValid = verifyPayuHash(params, salt);

    if (!isHashValid) {
      return NextResponse.redirect(new URL("/failure?error=hash", req.url));
    }

    const status = params.status?.toLowerCase();
    const origin = req.nextUrl.origin;

    if (status === "success") {
      return NextResponse.redirect(
        new URL(`/success?txnid=${params.txnid}&mihpayid=${params.mihpayid}`, origin)
      );
    } else {
      return NextResponse.redirect(
        new URL(
          `/failure?txnid=${params.txnid}&status=${status}&reason=${encodeURIComponent(params.field9 || "Payment failed")}`,
          origin
        )
      );
    }
  } catch (error) {
    console.error("PayU Callback Error:", error);
    return NextResponse.redirect(new URL("/failure?error=exception", req.url));
  }
}
