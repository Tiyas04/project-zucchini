import { CheckCircle } from "lucide-react";

export function CompleteStep() {
  return (
    <div className="text-center py-8">
      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to NITRUTSAV 2026!</h2>
      <p className="text-gray-600 mb-8">
        Your registration and payment have been successfully completed
      </p>

      <button
        onClick={() => (window.location.href = "/")}
        className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
}
