import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/footer";
import HOC from "@/components/hoc";

export const metadata: Metadata = {
  title: "Check-in | Nitrutsav",
  description: "Event check-in system",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${plusJakarta.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <HOC>{children}</HOC>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
