"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "@repo/firebase-config";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);

      if (!authUser && !pathname?.includes("/login")) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
