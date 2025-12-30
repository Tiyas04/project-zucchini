"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems, navbarImages } from "@/config/marginals";
import GradientUnderline from "./gradient";
import CountdownTimer from "./countdown-timer";
import MusicVisualizer from "./music-visualizer";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  const handleCloseMenu = () => setIsClosing(true);

  const toggleMenu = () => {
    if (isMenuOpen) handleCloseMenu();
    else setIsMenuOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-50 w-full px-6 pt-8 pb-2 transition-all duration-300  ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-[85rem] mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="md:hidden relative w-30 h-10 z-50">
            <Image
              src={navbarImages.mobileLogo}
              alt="Nitrutsav Logo"
              fill
              className="object-contain"
            />
          </Link>

          <nav className="hidden md:flex gap-8 lg:gap-12 text-white font-inria">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative group text-base lg:text-lg  tracking-wide transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {item.label}
                  <div
                    className={`absolute left-0 -bottom-2 h-[3px] transition-all duration-300 overflow-hidden ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  >
                    <GradientUnderline className="w-full h-full" />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6 md:gap-12">
          <div className="hidden md:block">
            <CountdownTimer />
          </div>

          {/* <div className="hidden md:block">
            <MusicVisualizer />
          </div> */}

          {/* Mobile Burger Menu */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white relative w-8 h-8 focus:outline-none z-50"
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isMenuOpen && !isClosing
                  ? "opacity-0 rotate-90 scale-50"
                  : "opacity-100 rotate-0 scale-100"
              }`}
            >
              <Menu size={32} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isMenuOpen && !isClosing
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-50"
              }`}
            >
              <X size={32} />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 min-h-screen bg-black/95 flex flex-col items-center justify-center md:hidden"
          style={{
            zIndex: 45,
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
          <nav className="flex flex-col gap-8 text-white text-2xl text-center font-inria">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`cursor-pointer relative group transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                  onClick={handleCloseMenu}
                >
                  {item.label}
                  <div
                    className={`absolute left-0 -bottom-2 h-[3px] transition-all duration-300 overflow-hidden ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  >
                    <GradientUnderline className="w-full h-full" />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
