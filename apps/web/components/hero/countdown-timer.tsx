"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-02-07T00:00:00");

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center mt-4 md:mt-0 md:absolute md:top-[2.5rem] md:right-[10rem]">
      <div className="flex items-start gap-[1vw] text-white font-[family-name:var(--font-baloo)]">
        {/* Days */}
        <div className="flex flex-col items-center">
          <span className="text-4xl md:text-[3.5vw] font-bold leading-none">{timeLeft.days}</span>
          <span className="text-sm md:text-[1.5vw] font-bold mt-1">DAYS</span>
        </div>
        <span className="text-4xl md:text-[3.5vw] font-bold leading-none mt-[-0.5vw]">:</span>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <span className="text-4xl md:text-[3.5vw] font-bold leading-none">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="text-sm md:text-[1.5vw] font-bold mt-1">HOURS</span>
        </div>
        <span className="text-4xl md:text-[3.5vw] font-bold leading-none mt-[-0.5vw]">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <span className="text-4xl md:text-[3.5vw] font-bold leading-none">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-sm md:text-[1.5vw] font-bold mt-1">MINUTES</span>
        </div>
      </div>
    </div>
  );
}
