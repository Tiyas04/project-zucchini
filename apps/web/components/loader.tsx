"use client";

import React, { useEffect, useState } from "react";
import NitrutsavText from "./hero/nitrutsav-text";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Minimum load time of 2.5 seconds to show the animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Remove from DOM after fade out
      setTimeout(() => setIsVisible(false), 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#010005] transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative w-[80vw] max-w-[600px] aspect-[1146/303]">
        <NitrutsavText />
      </div>
    </div>
  );
}
