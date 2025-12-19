import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-gray-900 animate-spin mx-auto mb-2" />
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}
