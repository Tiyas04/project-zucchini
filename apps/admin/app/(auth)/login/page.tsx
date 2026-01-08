"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle, signOut } from "@repo/firebase-config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleIcon from "@repo/ui/google-icon";
import { useApi } from "@repo/shared-utils";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function LoginPage({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const { loading: apiLoading, execute } = useApi();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setIsPendingVerification(false);
      const { user } = await signInWithGoogle();
      if (!user) return;

      const response = await execute("auth/login", {
        method: "GET",
      });

      if (response?.data?.redirectUrl) {
        router.push(response.data.redirectUrl);
        return;
      }

      if (response?.data?.isVerified) {
        router.push("/");
        return;
      }

      if (!response?.data?.isVerified) {
        setIsPendingVerification(true);
      } else {
        setErrorMessage("Access denied: You are not authorized to access the admin portal.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
        {isPendingVerification && (
          <Card className="border-amber-500/50 bg-amber-500/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Clock className="h-12 w-12 text-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Pending Verification</h3>
                  <p className="text-sm text-zinc-400 mt-2">
                    Your account is registered but pending verification. Please wait for an admin to
                    verify your account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {errorMessage && <p className="text-red-500 text-center font-medium">{errorMessage}</p>}

        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Please Enter your credentials to login</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading || apiLoading}
            >
              <GoogleIcon />
              {isLoading || apiLoading ? "Signing in..." : "Login with Google"}
            </Button>
            <p className="text-center text-sm text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-white hover:underline">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
