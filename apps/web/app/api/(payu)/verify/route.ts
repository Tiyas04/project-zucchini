import { NextRequest } from "next/server";
import { createHash } from "crypto";
import axios from "axios";
import { handleResponse, requireAuth } from "@repo/shared-utils/server";
import { handleError } from "@repo/shared-types";
import { updatePaymentStatusByTxnId } from "@repo/database";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const txnid = req.nextUrl.searchParams.get("txnid");

    if (!txnid) {
      return handleError(new Error("Transaction ID (txnid) is required"));
    }

    const key = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;
    const command = "verify_payment";

    if (!key || !salt) {
      return handleError(new Error("PayU configuration missing"));
    }

    const hashString = `${key}|${command}|${txnid}|${salt}`;
    const hash = createHash("sha512").update(hashString).digest("hex");

    const formData = new URLSearchParams();
    formData.append("key", key);
    formData.append("command", command);
    formData.append("var1", txnid);
    formData.append("hash", hash);

    const { data } = await axios.post(process.env.VERIFY_PAYMENT_URL!, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const isPaymentVerified =
      data?.status &&
      data.transaction_details[txnid].status === "success" &&
      data.transaction_details[txnid].error_code === "E000";

    const result = await updatePaymentStatusByTxnId(txnid, isPaymentVerified);
    if (!result) {
      return handleError(new Error("Failed to update payment status"));
    }
    return handleResponse({
      isVerified: result,
      txnid,
      mihpayid: data.transaction_details[txnid].mihpayid,
      amt: data.transaction_details[txnid].amt,
      bank_ref_num: data.transaction_details[txnid].bank_ref_num,
    });
  } catch (error) {
    return handleError(error);
  }
}
