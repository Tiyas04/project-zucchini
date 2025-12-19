"use client";

import { useState } from "react";
import Script from "next/script";
import { generateOrderId } from "@/utils/gen-order-id";
import { Loader2 } from "lucide-react";

interface RegistrationPaymentButtonProps {
  userId: number;
  userName: string;
  userEmail: string;
  onPaymentSuccess?: () => void;
  onPaymentFailure?: (error: string) => void;
}

export default function RegistrationPaymentButton({
  userId,
  userName,
  userEmail,
  onPaymentSuccess,
  onPaymentFailure,
}: RegistrationPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const orderId: string = await generateOrderId();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: "NITRUTSAV 2026",
        description: "Registration for NITRUTSAV 2026",
        order_id: orderId,

        handler: async function (response: any) {
          try {
            const paymentResponse = await fetch("/api/verify-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: userId.toString(),
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

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Proceed to Payment"
        )}
      </button>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
