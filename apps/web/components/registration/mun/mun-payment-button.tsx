"use client";

import { useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { munAmount } from "@/config";

interface MunPaymentButtonProps {
  munRegistrationId: number;
  userName: string;
  userEmail: string;
  studentType: "SCHOOL" | "COLLEGE";
  committeeChoice: string;
  onPaymentSuccess?: () => void;
  onPaymentFailure?: (error: string) => void;
}

export default function MunPaymentButton({
  munRegistrationId,
  userName,
  userEmail,
  studentType,
  committeeChoice,
  onPaymentSuccess,
  onPaymentFailure,
}: MunPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const orderResponse = await fetch("/api/mun/initiate-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentType,
          committeeChoice,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        onPaymentFailure?.(orderResult.error || "Failed to initiate payment");
        setIsLoading(false);
        return;
      }

      const { orderId, amount: orderAmount } = orderResult.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount * 100,
        currency: "INR",
        name: "NITRUTSAV 2026 - MUN",
        description: `MUN Registration - ${committeeChoice === "MOOT_COURT" ? "MOOT Court (Team of 3)" : "Overnight Crisis"}`,
        order_id: orderId,

        handler: async function (response: any) {
          try {
            const paymentResponse = await fetch("/api/mun/verify-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                munRegistrationId: munRegistrationId.toString(),
                amount: orderAmount,
              }),
            });

            const result = await paymentResponse.json();

            if (result.success) {
              onPaymentSuccess?.();
            } else {
              onPaymentFailure?.(result.error || "Payment verification failed");
            }
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.error || "Payment verification failed. Please contact support.";
            onPaymentFailure?.(errorMessage);
            console.error(error);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        onPaymentFailure?.("Payment failed. Please try again.");
        console.error(response.error);
      });
      razorpay.open();
    } catch (error) {
      onPaymentFailure?.("Failed to initiate payment. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseFee = studentType === "COLLEGE" ? munAmount.college : munAmount.school;
  const displayAmount = committeeChoice === "MOOT_COURT" ? baseFee * 3 : baseFee;

  return (
    <>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Registration Fee</h4>
          <p className="text-2xl font-bold text-blue-600">₹{displayAmount}</p>
          <p className="text-sm text-blue-700 mt-1">
            {studentType === "COLLEGE" ? "College Student" : "School Student"}
            {committeeChoice === "MOOT_COURT" && " - Team of 3"}
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${displayAmount}`
          )}
        </button>
      </div>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
