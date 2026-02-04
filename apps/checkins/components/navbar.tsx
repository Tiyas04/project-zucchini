"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, LogOut } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const operatorString =
    typeof window !== "undefined" ? localStorage.getItem("checkin_operator") : null;
  const operator = operatorString ? JSON.parse(operatorString) : null;

  const handleLogout = () => {
    localStorage.removeItem("checkin_operator");
    router.push("/");
  };

  return (
    <header className="px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <img src="/logo.svg" alt="Check-in" className="h-8" />
        {operator && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              title="Operator info"
            >
              <User className="h-5 w-5" />
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-56 rounded-lg bg-popover border border-border shadow-lg p-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize font-medium">{operator.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{operator.phone}</span>
                  </div>
                  <hr className="border-border" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
