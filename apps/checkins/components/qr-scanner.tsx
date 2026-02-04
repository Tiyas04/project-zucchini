"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { Camera, CameraOff } from "lucide-react";

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
  isProcessing?: boolean;
}

export interface QrScannerRef {
  stopScanning: () => Promise<void>;
}

export const QrScanner = forwardRef<QrScannerRef, QrScannerProps>(function QrScanner(
  { onScan, onError, isProcessing },
  ref
) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanning = async () => {
    if (!containerRef.current || isScanning || isProcessing) return;

    try {
      setCameraError(null);
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText: string) => {
          onScan(decodedText);
        },
        () => {
          // QR code not found in frame - silent
        }
      );

      setIsScanning(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start camera";
      setCameraError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        // Ignore cleanup errors
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useImperativeHandle(ref, () => ({
    stopScanning,
  }));

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const handleContainerClick = () => {
    if (!isScanning && !cameraError) {
      startScanning();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={`relative w-full max-w-sm aspect-square rounded-lg overflow-hidden border bg-muted ${
          !isScanning && !cameraError ? "cursor-pointer hover:border-primary transition-colors" : ""
        }`}
      >
        <div id="qr-reader" className="w-full h-full" />

        {!isScanning && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Camera className="mx-auto h-12 w-12 mb-2" />
              <p>Tap to open camera</p>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center text-destructive">
              <CameraOff className="mx-auto h-12 w-12 mb-2" />
              <p className="text-sm">{cameraError}</p>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center text-muted-foreground">
              <p>Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
