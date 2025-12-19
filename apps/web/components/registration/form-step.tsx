import { type User } from "@repo/firebase-config";
import RegistrationForm from "@/components/registration/registration-form";

interface FormStepProps {
  user: User;
  onComplete: (userId: number) => void;
}

export function FormStep({ user, onComplete }: FormStepProps) {
  return <RegistrationForm user={user} onComplete={onComplete} />;
}
