"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { QrScanner, QrScannerRef } from "@/components/qr-scanner";
import { SlideToConfirm } from "@/components/slide-to-confirm";
import { useCheckinMutation } from "@/lib/checkin/mutations";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";

const STORAGE_KEY = "checkin_operator";

interface OperatorData {
  name: string;
  phone: string;
}

type ResultType =
  | "success"
  | "not_found"
  | "not_verified"
  | "already_checked_in"
  | "validation_error"
  | "error";

interface ScannedData {
  userId: number;
  type: "nu" | "mun";
}

interface CheckinResult {
  type: ResultType;
  participantName?: string;
  message?: string;
}

function parseQrData(text: string): ScannedData | null {
  try {
    const params = new URLSearchParams(text);
    const id = params.get("id");
    const type = params.get("type");

    if (!id || !type) return null;
    if (type !== "nu" && type !== "mun") return null;

    const userId = parseInt(id, 10);
    if (isNaN(userId) || userId <= 0) return null;

    return { userId, type };
  } catch {
    return null;
  }
}

const errorMessages: Record<string, string> = {
  not_found: "Registration not found",
  not_verified: "Registration not verified",
  already_checked_in: "Participant already checked in",
  validation_error: "Invalid request data",
  server_error: "An error occurred",
};

export default function CheckinPage() {
  const router = useRouter();
  const [operator, setOperator] = useState<OperatorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [checkinResult, setCheckinResult] = useState<CheckinResult | null>(null);
  const lastScannedRef = useRef<string>("");
  const scannerRef = useRef<QrScannerRef>(null);

  const checkinMutation = useCheckinMutation();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const data: OperatorData = JSON.parse(stored);
      if (!data.name || !data.phone) {
        router.replace("/");
        return;
      }
      setOperator(data);
    } catch {
      router.replace("/");
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleScan = useCallback(async (decodedText: string) => {
    if (decodedText === lastScannedRef.current) return;
    lastScannedRef.current = decodedText;

    const parsed = parseQrData(decodedText);

    if (!parsed) {
      setCheckinResult({
        type: "error",
        message: "Invalid QR code format",
      });
      return;
    }

    // Stop camera and show scanned data
    await scannerRef.current?.stopScanning();
    setScannedData(parsed);
    setCheckinResult(null);
  }, []);

  const handleConfirmCheckin = useCallback(async () => {
    if (!scannedData || !operator) return;

    try {
      const response = await checkinMutation.mutateAsync({
        userId: scannedData.userId,
        type: scannedData.type,
        checkInBy: {
          name: operator.name,
          phone: operator.phone,
        },
        timestamp: new Date().toISOString(),
      });

      if (response.success) {
        setCheckinResult({
          type: "success",
          participantName: response.participant.name,
        });
      } else if (response.success === false) {
        const errorType: ResultType =
          response.error === "not_found" ||
          response.error === "not_verified" ||
          response.error === "already_checked_in" ||
          response.error === "validation_error"
            ? response.error
            : "error";
        setCheckinResult({
          type: errorType,
          message: errorMessages[response.error] || response.message,
        });
      }
    } catch {
      setCheckinResult({
        type: "error",
        message: "Failed to process check-in",
      });
    }
  }, [scannedData, operator, checkinMutation]);

  const handleReset = () => {
    setScannedData(null);
    setCheckinResult(null);
    lastScannedRef.current = "";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!scannedData ? (
          <>
            <QrScanner
              ref={scannerRef}
              onScan={handleScan}
              isProcessing={checkinMutation.isPending}
            />
            <p className="text-center text-sm text-muted-foreground mt-4">
              Point camera at participant&apos;s QR code
            </p>

            {/* Error display */}
            {checkinResult && checkinResult.type === "error" && (
              <div className="mt-4 p-4 border border-destructive rounded-lg bg-destructive/10">
                <p className="text-center text-destructive">{checkinResult.message}</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            {/* Scanned user info */}
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Scanned QR Code</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={checkinMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Registration ID</span>
                  <span className="font-medium">{scannedData.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registration Type</span>
                  <span className="font-medium uppercase">
                    {scannedData.type === "nu" ? "NITRUTSAV" : "NITRMUN"}
                  </span>
                </div>
              </div>
            </div>

            {/* Result display */}
            {checkinResult && (
              <div
                className={`p-4 border rounded-lg ${
                  checkinResult.type === "success"
                    ? "border-green-500 bg-green-500/10"
                    : "border-destructive bg-destructive/10"
                }`}
              >
                {checkinResult.type === "success" ? (
                  <div className="text-center">
                    <p className="font-medium text-green-600">Check-in Successful</p>
                    {checkinResult.participantName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {checkinResult.participantName}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-destructive">{checkinResult.message}</p>
                )}
              </div>
            )}

            {/* Slide to confirm or Next button */}
            {!checkinResult ? (
              <SlideToConfirm
                onConfirm={handleConfirmCheckin}
                isLoading={checkinMutation.isPending}
              />
            ) : (
              <Button onClick={handleReset} className="w-full">
                {checkinResult.type === "success" ? "Next Scan" : "Try Again"}
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
