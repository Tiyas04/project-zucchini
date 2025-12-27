import GoogleIcon from "@repo/ui/google-icon";
import { Loader2 } from "lucide-react";

interface AuthStepProps {
  onGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function AuthStep({ onGoogleSignIn, isLoading, error }: AuthStepProps) {
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome</h2>
      <p className="text-gray-600 mb-8">Sign in with your Google account to begin registration</p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={onGoogleSignIn}
        disabled={isLoading}
        className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
    </div>
  );
}
