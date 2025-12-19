"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/config/marginals";

export default function Navbar() {
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

  return (
    <>
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
          className="fixed inset-0 bg-black/90 z-40 flex flex-col items-center justify-center md:hidden animate-slide-fade-in"
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
              <Link
                key={item.label}
                href={item.href}
                className="cursor-pointer relative group"
                onClick={handleCloseMenu}
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop Navigation - Top Left */}
      <nav className="hidden md:flex flex-wrap justify-start gap-[3.5vw] text-white text-[1.25vw] pt-0 absolute top-[3rem] left-[4rem]">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="cursor-pointer relative group">
            {item.label}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </nav>
    </>
  );
}
