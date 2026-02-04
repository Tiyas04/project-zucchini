"use client";

import { signInWithGoogle } from "@repo/firebase-config";
import { useMunRegistration } from "@/hooks/use-mun-registration";
import { LoadingState, AuthStep } from "@/components/registration";
import {
  LeaderFormStep,
  Teammate1FormStep,
  Teammate2FormStep,
  MunPaymentStep,
  MunInfoStep,
  MunCompleteStep,
} from "@/components/registration/mun";

import SectionHeading from "@/components/ui/section-heading";
import { ArrowLeft } from "lucide-react";
import { MunProgressBar } from "@/components/registration/mun-progress-bar";

export default function MunRegisterPage() {
  const {
    user,
    currentStep,
    userData,
    isLoading,
    error,
    paymentError,
    teamNitrStatus,
    teamData,
    teamId,
    handleRegistrationComplete,
    handlePaymentFailure,
    handleBackStep,
    handleProceedToRegister,
    setError,
    handleNitrStatusChange,
  } = useMunRegistration();

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const isTeamRegistration = currentStep === "form-leader";
  const showBackButton =
    currentStep === "auth" || currentStep === "form" || currentStep === "form-leader";

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden reg-bg-image">
      <div className="max-w-full mx-auto relative z-10 mt-24">
        <SectionHeading title="MUN Registration" containerClassName="mb-20" />

        {currentStep !== "info" && <MunProgressBar currentStep={currentStep} />}
        <div className="max-w-5xl mx-auto p-6 font-inria form-container gradient-border">
          <p className="text-white/70 text-sm text-center mb-4">
            Note: Registering for MUN also grants you access to NITRUTSAV 2026.
          </p>
          {showBackButton && (
            <button
              onClick={handleBackStep}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 font-inria"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>About MUN</span>
            </button>
          )}

          {currentStep === "info" && <MunInfoStep onProceedToRegister={handleProceedToRegister} />}

          {currentStep === "auth" && (
            <AuthStep onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} error={error} />
          )}

          {(currentStep === "form" || currentStep === "form-leader") && user && (
            <LeaderFormStep
              user={user}
              teamData={teamData}
              teamNitrStatus={teamNitrStatus}
              isTeamRegistration={isTeamRegistration}
              onComplete={handleRegistrationComplete}
              onNitrStatusChange={handleNitrStatusChange}
            />
          )}

          {currentStep === "form-teammate1" && user && (
            <Teammate1FormStep
              user={user}
              teamData={teamData}
              teamNitrStatus={teamNitrStatus}
              onComplete={handleRegistrationComplete}
              onBack={handleBackStep}
            />
          )}

          {currentStep === "form-teammate2" && user && (
            <Teammate2FormStep
              user={user}
              teamData={teamData}
              teamNitrStatus={teamNitrStatus}
              onComplete={handleRegistrationComplete}
              onBack={handleBackStep}
            />
          )}

          {currentStep === "payment" && userData && (
            <MunPaymentStep
              userData={userData}
              paymentError={paymentError}
              onPaymentFailure={handlePaymentFailure}
              teamId={teamId}
            />
          )}

          {currentStep === "complete" && (
            <MunCompleteStep
              registrationId={teamId}
              userEmail={userData?.email}
              userName={userData?.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
