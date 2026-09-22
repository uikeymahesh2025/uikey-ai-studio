import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StudioProvider } from "@/lib/store/store-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "UIKEY AI Studio — Shoot se delivery tak, photographers ka intelligent workspace",
  description:
    "The intelligent photography business management platform for Indian freelance photographers, wedding studios, editors, and portrait creators. Manage leads, quotations, proofing galleries, manual UPI payments, and deliverables.",
  keywords: [
    "wedding photography software",
    "photographer CRM India",
    "photo proofing gallery",
    "freelance photographer workspace",
    "wedding studio management",
    "UPI payment photography",
  ],
  authors: [{ name: "UIKEY AI" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-studio-bg text-studio-primary font-sans antialiased selection:bg-studio-accent selection:text-studio-bg">
        <StudioProvider>{children}</StudioProvider>
      </body>
    </html>
  );
}
