import { StepIndicator } from "./step-indicator";

type RegistrationStep = "auth" | "form" | "payment" | "complete";

interface ProgressBarProps {
  currentStep: RegistrationStep;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-3">
        <StepIndicator
          step={1}
          label="Sign In"
          active={currentStep === "auth"}
          completed={currentStep !== "auth"}
        />
        <div className="w-12 h-0.5 bg-gray-300">
          <div
            className={`h-full bg-gray-900 transition-all duration-300 ${
              currentStep !== "auth" ? "w-full" : "w-0"
            }`}
          />
        </div>
        <StepIndicator
          step={2}
          label="Details"
          active={currentStep === "form"}
          completed={currentStep === "payment" || currentStep === "complete"}
        />
        <div className="w-12 h-0.5 bg-gray-300">
          <div
            className={`h-full bg-gray-900 transition-all duration-300 ${
              currentStep === "payment" || currentStep === "complete" ? "w-full" : "w-0"
            }`}
          />
        </div>
        <StepIndicator
          step={3}
          label="Payment"
          active={currentStep === "payment"}
          completed={currentStep === "complete"}
        />
      </div>
    </div>
  );
}
