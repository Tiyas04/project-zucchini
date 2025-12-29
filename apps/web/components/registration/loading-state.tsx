import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div
      className="min-h-screen flex items-center justify-center
     reg-bg-image"
    >
      <div className="text-center p-8 flex  items-center justify-center ">
        <div className="gradient-border p-8 backdrop-blur-[9.25px]">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-inria font-semibold">Loading...</p>
        </div>
      </div>
    </div>
  );
}
