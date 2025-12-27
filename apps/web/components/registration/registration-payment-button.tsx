"use client";

import { useApi } from "@repo/shared-utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RegistrationPaymentButtonProps {
  userName: string;
  userEmail: string;
  onPaymentFailure?: (error: string) => void;
}

export default function RegistrationPaymentButton({
  userName,
  userEmail,
  onPaymentFailure,
}: RegistrationPaymentButtonProps) {
  const { execute, loading: isLoading } = useApi({
    onError(error) {
      console.error(error);
      toast.error(error || "Failed to initiate payment!");
    },
  });

  const handleSubmit = async () => {
    const result = await execute("pay", {
      method: "POST",
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        type: "NITRUTSAV",
      }),
    });

    if (!result) {
      onPaymentFailure?.("Failed to initiate payment");
      return;
    }

    const { url, ...params } = result as { url: string; params: Record<string, string> };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;

    for (const key in params) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      // @ts-ignore
      input.value = params[key];
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <button
        onClick={handleSubmit}
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
    </>
  );
}
