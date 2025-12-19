"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle, signOut } from "@repo/firebase-config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleIcon from "@/components/google";
import { useApi } from "@repo/shared-utils";

export default function LoginPage({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { loading: apiLoading, execute } = useApi();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const { user } = await signInWithGoogle();
      if (!user) return;

      const response = await execute("auth/login", {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
      });

      if (response?.amIAdmin) {
        router.push("/registrations");
      } else {
        await signOut();
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
        {errorMessage && <p className="text-red-500 text-center font-medium">{errorMessage}</p>}
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Please Enter your credentials to login</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
