"use client";
import { LoadingState } from "@/components/registration";
import { useApi } from "@repo/shared-utils";
import { toast } from "sonner";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";

interface TransactionDetails {
  isVerified: boolean;
  txnid: string;
  mihpayid: string;
  amt: string;
  bank_ref_num?: string;
}

function SuccessContent() {
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failure" | "pending">("pending");
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  const { execute, loading: isLoading } = useApi({
    onError(error) {
      toast.error(error || "Failed to verify payment!");
    },
  });

  useEffect(() => {
    const verifyPayment = async () => {
      if (user) {
        const txnid = searchParams.get("txnid");
        if (!txnid) {
          toast.error("Transaction ID not found!");
          setPaymentStatus("failure");
          return;
        }

        const res = await execute(`verify?txnid=${txnid}`, {
          method: "GET",
        });

        if (!res.success) {
          toast.error("Failed to verify payment!");
          setPaymentStatus("failure");
        } else if (res.data?.isVerified) {
          setTransactionDetails(res.data as TransactionDetails);
          setPaymentStatus("success");
          toast.success("Payment verified successfully!");
        } else {
          setPaymentStatus("failure");
          toast.error("Payment verification failed");
        }
      }
    };

    verifyPayment();
  }, [user]);

  if (authLoading || isLoading || paymentStatus === "pending") return <LoadingState />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {paymentStatus === "success" ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">Your payment has been verified.</p>
            {transactionDetails && (
              <div className="text-left bg-gray-50 rounded p-4 mt-4">
                <p className="text-sm">
                  <strong>Transaction ID:</strong> {transactionDetails.txnid}
                </p>
                <p className="text-sm">
                  <strong>PayU ID:</strong> {transactionDetails.mihpayid}
                </p>
                <p className="text-sm">
                  <strong>Amount:</strong> ₹{transactionDetails.amt}
                </p>
                {transactionDetails.bank_ref_num && (
                  <p className="text-sm">
                    <strong>Bank Ref:</strong> {transactionDetails.bank_ref_num}
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Verification Failed</h1>
            <p className="text-gray-600">Unable to verify your payment. Please contact support.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuccessContent />
    </Suspense>
  );
}
