"use client";

import { useState, useEffect } from "react";
import { signInWithGoogle, onAuthStateChanged, type User } from "@repo/firebase-config";
import { useApi } from "@repo/shared-utils/src/use-api";
import { LoadingState, ProgressBar, AuthStep, CompleteStep } from "@/components/registration";
import { MunRegistrationForm, MunPaymentButton } from "@/components/registration/mun";

type RegistrationStep = "auth" | "form" | "payment" | "complete";

interface UserData {
  userId: number;
  name: string;
  email: string;
  studentType?: "SCHOOL" | "COLLEGE";
  committeeChoice?: string;
}

interface CheckMunRegistrationResponse {
  isRegistered: boolean;
  userId?: number;
  name?: string;
  email?: string;
  isPaymentVerified?: boolean;
}

export default function MunRegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("auth");
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { execute: checkRegistration } = useApi<CheckMunRegistrationResponse>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const result = await checkRegistration("mun/check-registration", {
            method: "POST",
            body: JSON.stringify({ firebaseUid: firebaseUser.uid }),
          });

          if (result?.isRegistered) {
            setUserData({
              userId: result.userId!,
              name: result.name!,
              email: result.email!,
            });

            if (result.isPaymentVerified) {
              setCurrentStep("complete");
            } else {
              setCurrentStep("payment");
            }
          } else {
            setCurrentStep("form");
          }
        } catch (error) {
          console.error("Failed to check MUN registration status:", error);
          setCurrentStep("form");
        }
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    userId: number,
    studentType: string,
    committeeChoice: string
  ) => {
    setUserData({
      userId,
      name: user?.displayName || "",
      email: user?.email || "",
      studentType: studentType as "SCHOOL" | "COLLEGE",
      committeeChoice,
    });
    setCurrentStep("payment");
  };

  const handlePaymentSuccess = () => {
    setCurrentStep("complete");
  };

  const handlePaymentFailure = (errorMessage: string) => {
    setPaymentError(errorMessage);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Register for MUN - NITRUTSAV 2026
          </h1>
          <p className="text-gray-600">Model United Nations Registration</p>
        </div>
        <ProgressBar currentStep={currentStep} />
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          {currentStep === "auth" && (
            <AuthStep onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} error={error} />
          )}

          {currentStep === "form" && user && (
            <MunRegistrationForm
              user={user}
              onComplete={(userId, studentType, committeeChoice) =>
                handleRegistrationComplete(userId, studentType, committeeChoice)
              }
            />
          )}

          {currentStep === "payment" && userData && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
                <p className="text-gray-600">Complete your MUN registration payment</p>
              </div>

              {paymentError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {paymentError}
                </div>
              )}

              <MunPaymentButton
                munRegistrationId={userData.userId}
                userName={userData.name}
                userEmail={userData.email}
                studentType={userData.studentType || "COLLEGE"}
                committeeChoice={userData.committeeChoice || "OVERNIGHT_CRISIS"}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentFailure={handlePaymentFailure}
              />
            </div>
          )}

          {currentStep === "complete" && <CompleteStep />}
        </div>
      </div>
    </div>
  );
}
