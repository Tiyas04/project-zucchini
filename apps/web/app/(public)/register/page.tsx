"use client";
import { useState, useEffect } from "react";
import { signInWithGoogle } from "@repo/firebase-config";
import { useApi } from "@repo/shared-utils";
import { useAuth } from "@/contexts/auth-context";
import {
  LoadingState,
  ProgressBar,
  AuthStep,
  FormStep,
  PaymentStep,
  CompleteStep,
} from "@/components/registration";
import SectionHeading from "@/components/ui/section-heading";

type RegistrationStep = "auth" | "form" | "payment" | "complete";

export interface UserData {
  name: string;
  email: string;
  wantsAccommodation?: boolean;
}

interface CheckRegistrationResponse {
  isMunRegistered: boolean;
  isNitrutsavRegistered: boolean;
  registrationType: "MUN" | "NITRUTSAV" | null;
  userId: number | null;
  name: string | null;
  email: string | null;
  referralCode: string | null;
  isPaymentVerified: boolean;
  isNitrStudent: boolean;
  isVerified: boolean;
}

export default function RegisterPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("auth");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { execute: checkRegistration } = useApi<CheckRegistrationResponse>();

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!user) {
        setCurrentStep("auth");
        setIsLoading(false);
        return;
      }

      try {
        const result = await checkRegistration("check-cross-registration", {
          method: "GET",
        });

        if (result.success && result.data?.isNitrutsavRegistered) {
          setUserData({
            name: result.data.name!,
            email: result.data.email!,
          });
          setUserId(result.data.userId);

          if (result.data.referralCode) {
            setReferralCode(result.data.referralCode);
          }

          if (
            result.data.isPaymentVerified ||
            (result.data.isNitrStudent && result.data.isVerified)
          ) {
            setCurrentStep("complete");
          } else {
            setCurrentStep("payment");
          }
        } else {
          // User not registered - show form
          setCurrentStep("form");
        }
      } catch (error) {
        console.error("Failed to check registration status:", error);
        // On error, show form
        setCurrentStep("form");
      }

      setIsLoading(false);
    };

    if (!authLoading) {
      checkRegistrationStatus();
    }
  }, [user, authLoading]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  const handleRegistrationComplete = (
    isNitrStudent: boolean = false,
    wantsAccommodation: boolean = false,
    generatedReferralCode?: string
  ) => {
    setUserData({
      name: user?.displayName || "",
      email: user?.email || "",
      wantsAccommodation,
    });

    if (generatedReferralCode) {
      setReferralCode(generatedReferralCode);
    }

    if (isNitrStudent) {
      setCurrentStep("complete");
    } else {
      setCurrentStep("payment");
    }
  };

  const handlePaymentFailure = (errorMessage: string) => {
    setPaymentError(errorMessage);
  };

  if (authLoading || isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen pt-20 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden reg-bg-image">
      <div className="max-w-full mx-auto relative z-10 mt-24">
        <SectionHeading title="Registrations" />
        <ProgressBar currentStep={currentStep} />
        <div className="max-w-5xl mx-auto p-6 font-inria form-container gradient-border">
          {currentStep === "auth" && (
            <AuthStep onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} error={error} />
          )}

          {currentStep === "form" && user && (
            <FormStep user={user} onComplete={handleRegistrationComplete} />
          )}

          {currentStep === "payment" && userData && (
            <PaymentStep
              userData={userData}
              paymentError={paymentError}
              onPaymentFailure={handlePaymentFailure}
            />
          )}

          {currentStep === "complete" && (
            <CompleteStep userId={userId} referralCode={referralCode} />
          )}
        </div>
      </div>
    </div>
  );
}
