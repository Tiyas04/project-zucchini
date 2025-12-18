import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/marginals/footer";

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
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
