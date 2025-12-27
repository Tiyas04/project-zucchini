"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInWithGoogle, signOut } from "@repo/firebase-config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleIcon from "@repo/ui/google-icon";
import { useApi } from "@repo/shared-utils";
import Link from "next/link";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

type RegistrationStatus = "idle" | "pending" | "success" | "already-registered";

export default function RegisterPage({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<RegistrationStatus>("idle");
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState("");
  const { loading: apiLoading, execute } = useApi();

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const { user } = await signInWithGoogle();
      if (!user) return;

      const response = await execute("auth/register", {
        method: "POST",
        body: JSON.stringify({ name: name || user.displayName }),
      });

      if (response?.data?.success) {
        setStatus("success");
      } else if (response?.data?.error === "Already registered") {
        setStatus("already-registered");
        setIsVerified(response?.data?.isVerified || false);
      } else {
        setErrorMessage(response?.data?.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
        {status === "success" && (
          <Card className="border-emerald-500/50 bg-emerald-500/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Clock className="h-12 w-12 text-amber-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Registration Successful!</h3>
                  <p className="text-sm text-zinc-400 mt-2">
                    Your account is pending verification. You will be able to login once an existing
                    admin verifies your account.
                  </p>
                </div>
                <Button variant="outline" onClick={handleGoToLogin}>
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {status === "already-registered" && (
          <Card
            className={
              isVerified
                ? "border-emerald-500/50 bg-emerald-500/10"
                : "border-amber-500/50 bg-amber-500/10"
            }
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                {isVerified ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-emerald-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">Already Verified!</h3>
                      <p className="text-sm text-zinc-400 mt-2">
                        Your account is already verified. You can login now.
                      </p>
                    </div>
                    <Button onClick={handleGoToLogin}>Go to Login</Button>
                  </>
                ) : (
                  <>
                    <Clock className="h-12 w-12 text-amber-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">Already Registered</h3>
                      <p className="text-sm text-zinc-400 mt-2">
                        Your account is pending verification. Please wait for an admin to verify
                        your account.
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleGoToLogin}>
                      Go to Login
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {status === "idle" && (
          <>
            {errorMessage && (
              <div className="flex items-center gap-2 text-red-500 justify-center">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Admin Registration</CardTitle>
                <CardDescription>
                  Register for admin access. Your account will need to be verified before you can
                  login.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={handleGoogleRegister}
                  disabled={isLoading || apiLoading}
                >
                  <GoogleIcon />
                  {isLoading || apiLoading ? "Registering..." : "Register with Google"}
                </Button>
                <p className="text-center text-sm text-zinc-500">
                  Already have an account?{" "}
                  <Link href="/login" className="text-white hover:underline">
                    Login
                  </Link>
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
