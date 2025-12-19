"use client";

import { Fireworks } from "@fireworks-js/react";

export default function FireworksEffects() {
  const fireworksOptions: any = {
    rocketsPoint: { min: 0, max: 100 },
    intensity: 40,
    explosion: 5,
    traceLength: 3,
    colors: ["#FFD700", "#FFC107", "#FFB300", "#FFF3B0"],
    lineWidth: { explosion: { min: 2, max: 4 }, trace: { min: 1, max: 2 } },
    traceSpeed: 4,
    explosionRadius: 5,
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Fireworks options={fireworksOptions} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
