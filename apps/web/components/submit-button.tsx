"use client";

import axios from "axios";
import React, { useState } from "react";
import Script from "next/script";
import { generateOrderId } from "@/utils/gen-order-id";

export default function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const orderId: string = await generateOrderId();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: "NITRUTSAV 2026",
        description: "Registeration for NITRUTSAV 2026",
        order_id: orderId,

        handler: async function (response: any) {
          try {
            const paymentResponse = await axios.post("/api/verify-order", {
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userDocumentId: "DOCUMENT_ID",
            });

            if (paymentResponse.data.success) {
              alert("Payment Successful!");
              console.log(paymentResponse.data.data);
            } else {
              alert(paymentResponse.data.error || "Payment verification failed");
            }
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.error || "Payment verification failed. Please contact support.";
            alert(errorMessage);
            console.error(error);
          }
        },
        prefill: {
          name: "USER_NAME",
          email: "USER_EMAIL",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        alert("Payment failed");
        console.error(response.error);
      });
      razorpay.open();
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={handlePayment} disabled={isLoading}>
        {isLoading ? "Processing..." : "Submit"}
      </button>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
