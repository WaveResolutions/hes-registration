import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HES — Child Signup | May 30, 2026",
  description:
    "Sign up your child for childcare services at Hamro Event Solutions LLC private event on Saturday, May 30, 2026. Safe, supervised, structured childcare from 8 AM to 9 PM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#FEFCF8] font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
