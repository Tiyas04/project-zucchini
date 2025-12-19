import { Check } from "lucide-react";

interface StepIndicatorProps {
  step: number;
  label: string;
  active: boolean;
  completed: boolean;
}

export function StepIndicator({ step, label, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
          completed
            ? "bg-green-600 text-white"
            : active
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-500"
        }`}
      >
        {completed ? <Check className="w-4 h-4" /> : step}
      </div>
      <span
        className={`mt-1 text-xs font-medium ${
          active ? "text-gray-900" : completed ? "text-green-600" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
