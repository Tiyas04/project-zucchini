"use client";

import { signInWithGoogle } from "@repo/firebase-config";
import { useMunRegistration } from "@/hooks/use-mun-registration";
import { LoadingState, ProgressBar, AuthStep, CompleteStep } from "@/components/registration";
import {
  LeaderFormStep,
  Teammate1FormStep,
  Teammate2FormStep,
  MunPaymentStep,
} from "@/components/registration/mun";
import SectionHeading from "@/components/ui/section-heading";

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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden reg-bg-image">
      <div className="max-w-full mx-auto relative z-10 mt-24">
        <SectionHeading title="MUN Registration" />

        <ProgressBar currentStep={currentStep} />
        <div className="max-w-5xl mx-auto p-6 font-inria form-container gradient-border">
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

          {currentStep === "complete" && <CompleteStep />}
        </div>
      </div>
    </div>
  );
}
