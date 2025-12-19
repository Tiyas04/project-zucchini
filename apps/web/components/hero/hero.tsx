"use client";

import { Baloo_2, Inria_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-baloo",
});
const inriaSans = Inria_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inria",
});

const imgImage19 =
  "https://res.cloudinary.com/drf3eatfm/image/upload/v1766131751/nitrutsav-2026/ym2o9u5n0owuoznofbyb.png";
const imgLayer1 =
  "https://res.cloudinary.com/drf3eatfm/image/upload/v1766132584/nitrutsav-2026/mptiw6aey46istxklkq5.png";
const imgEllipse1 =
  "https://res.cloudinary.com/drf3eatfm/image/upload/v1766133819/nitrutsav-2026/asrs2cbnpfc4ecanya1z.png";

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseMenu = () => {
    setIsClosing(true);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      handleCloseMenu();
    } else {
      setIsMenuOpen(true);
    }
  };

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

  const navItems = ["Home", "About", "Events", "FAQs", "Sponsors"];

  return (
    <main
      className={`${baloo.variable} ${inriaSans.variable} min-h-screen bg-[#010005] overflow-hidden relative font-[family-name:var(--font-inria)]`}
    >
      <style>{`
        @keyframes slideFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideFadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            width={1920}
            height={1080}
            alt="Background"
            className="absolute h-full w-full object-cover"
            src={imgImage19}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(223.4786651662683deg, rgba(0, 0, 0, 0) 37.108%, rgba(0, 0, 0, 0.82) 89.847%)",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:block">
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-6 md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white z-50 relative w-8 h-8 focus:outline-none"
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
                isMenuOpen && !isClosing
                  ? "opacity-0 rotate-90 scale-50"
                  : "opacity-100 rotate-0 scale-100"
              }`}
            >
              <Menu size={32} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
                isMenuOpen && !isClosing
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-50"
              }`}
            >
              <X size={32} />
            </span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/90 z-40 flex flex-col items-center justify-center md:hidden"
            style={{
              animation: isClosing
                ? "slideFadeOut 0.3s ease-in forwards"
                : "slideFadeIn 0.3s ease-out forwards",
            }}
            onAnimationEnd={() => {
              if (isClosing) {
                setIsMenuOpen(false);
                setIsClosing(false);
              }
            }}
          >
            <nav className="flex flex-col gap-8 text-white text-2xl text-center">
              {navItems.map((item) => (
                <p key={item} className="cursor-pointer relative group" onClick={handleCloseMenu}>
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </p>
              ))}
            </nav>
          </div>
        )}

        {/* Desktop Navigation - Top Left */}
        <nav className="hidden md:flex flex-wrap justify-start gap-[3.5vw] text-white text-[1.25vw] pt-0 absolute top-[3rem] left-[4rem]">
          {navItems.map((item) => (
            <p key={item} className="cursor-pointer relative group">
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </p>
          ))}
        </nav>

        {/* Countdown Timer - Top Right */}
        <div className="flex justify-center mt-4 md:mt-0 md:absolute md:top-[2.5rem] md:right-[10rem]">
          <div className="flex items-start gap-[1vw] text-white font-[family-name:var(--font-baloo)]">
            {/* Days */}
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-[3.5vw] font-bold leading-none">
                {timeLeft.days}
              </span>
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

        {/* Circle Element - Top Right */}
        <div className="hidden md:block absolute top-[2rem] right-[3rem] w-[4.5vw] h-[4.5vw]">
          <Image width={72} height={72} alt="" className="w-full h-full" src={imgEllipse1} />
        </div>

        {/* Logo - Bottom Left (Desktop) / Center (Mobile) */}
        <div className="flex-1 flex items-center justify-center md:block md:absolute md:bottom-[8rem] md:left-[4rem] md:flex-none">
          <div className="w-[90vw] md:w-[40vw]">
            <Image
              width={400}
              height={400}
              alt="NITRUTSAV Logo"
              className="w-full h-full object-contain"
              src={imgLayer1}
            />
          </div>
        </div>

        {/* Date - Bottom Left */}
        <div className="text-center md:text-left pb-12 md:pb-0 md:absolute md:bottom-[3rem] md:left-[5rem]">
          <p className="text-white text-2xl md:text-[3.4vw] font-bold font-[family-name:var(--font-baloo)] tracking-wide">
            7th-9th February, 2026
          </p>
        </div>
      </div>
    </main>
  );
}
