import type { Metadata } from "next";
import "./globals.css";
import { fonts } from "@/fonts";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { EventCategoryProvider } from "@/contexts/event-category-context";
import Header from "../components/marginals/navbar";
import Footer from "../components/marginals/footer";
import HOC from "@/components/hoc";
import { AudioProvider } from "@/contexts/audio-context";
export const metadata: Metadata = {
  title: "Nitrutsav 2026 | Literary and Cultural Fest - NIT Rourkela",
  description:
    "NITRUTSAV 2026, the Literary and Cultural Fest of NIT Rourkela. A creative outlet to commemorate and explore ingenuity and innovation through cultural events, performances, and celebrations.",
  keywords: ["Nitrutsav", "NIT Rourkela", "Cultural Fest", "Literary Fest", "2026", "College Fest"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="theme-color" content="#1A0D51" />

      <body className={`${fonts}`}>
        <AuthProvider>
          <EventCategoryProvider>
            <AudioProvider>
              <HOC>
                <div className="flex flex-col min-h-screen items-center justify-center">
                Coming soon.
                  Team NU26
                </div>
              </HOC>
            </AudioProvider>

            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: {
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(9.25px)",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: "13px",
                  color: "#fff",
                  fontFamily: "var(--font-inria)",
                  fontWeight: "500",
                },
                className: "font-inria",
              }}
            />
          </EventCategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
