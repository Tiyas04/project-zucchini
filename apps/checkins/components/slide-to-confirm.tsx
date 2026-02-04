"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SlideToConfirmProps {
  onConfirm: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  text?: string;
}

export function SlideToConfirm({
  onConfirm,
  isLoading = false,
  disabled = false,
  text = "Slide to check in",
}: SlideToConfirmProps) {
  const [slideProgress, setSlideProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  const THUMB_SIZE = 48;
  const CONFIRM_THRESHOLD = 0.9;

  const handleStart = useCallback(
    (clientX: number) => {
      if (disabled || isLoading || hasTriggeredRef.current) return;
      setIsDragging(true);
    },
    [disabled, isLoading]
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !trackRef.current || hasTriggeredRef.current) return;

      const track = trackRef.current;
      const rect = track.getBoundingClientRect();
      const maxSlide = rect.width - THUMB_SIZE;
      const currentX = clientX - rect.left - THUMB_SIZE / 2;
      const progress = Math.max(0, Math.min(1, currentX / maxSlide));

      setSlideProgress(progress);

      if (progress >= CONFIRM_THRESHOLD && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        setSlideProgress(1);
        setIsDragging(false);
        onConfirm();
      }
    },
    [isDragging, onConfirm]
  );

  const handleEnd = useCallback(() => {
    if (!hasTriggeredRef.current) {
      setSlideProgress(0);
    }
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleMouseUp = () => handleEnd();
  const handleMouseLeave = () => handleEnd();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleStart(e.touches[0].clientX);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };
  const handleTouchEnd = () => handleEnd();

  const reset = useCallback(() => {
    hasTriggeredRef.current = false;
    setSlideProgress(0);
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative h-14 w-full rounded-full bg-muted overflow-hidden select-none",
        disabled && "opacity-50 cursor-not-allowed",
        isLoading && "cursor-wait"
      )}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Track text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm text-muted-foreground">{isLoading ? "Processing..." : text}</span>
      </div>

      {/* Progress fill */}
      <div
        className="absolute inset-y-0 left-0 bg-primary/20 transition-none"
        style={{ width: `${slideProgress * 100}%` }}
      />

      {/* Thumb */}
      <div
        className={cn(
          "absolute top-1 bottom-1 w-12 rounded-full bg-primary flex items-center justify-center cursor-grab transition-none",
          isDragging && "cursor-grabbing",
          (disabled || isLoading) && "cursor-not-allowed"
        )}
        style={{
          left: `calc(${slideProgress * 100}% - ${slideProgress * THUMB_SIZE}px + 4px)`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <svg
          className="w-5 h-5 text-primary-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
