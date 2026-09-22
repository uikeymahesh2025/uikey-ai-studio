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
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://uikey-ai-studio.vercel.app"
  ),
  title: {
    default: "UIKEY AI Studio — Shoot se delivery tak, photographers ka intelligent workspace",
    template: "%s · UIKEY AI Studio",
  },
  description:
    "The intelligent photography business management platform for Indian freelance photographers, wedding studios, editors, and portrait creators. Manage leads, quotations, proofing galleries, manual UPI payments, and deliverables.",
  keywords: [
    "wedding photography software",
    "photographer CRM India",
    "photo proofing gallery",
    "freelance photographer workspace",
    "wedding studio management",
    "UPI payment photography",
    "photography contract generator",
    "GST invoice photography India",
  ],
  authors: [{ name: "UIKEY AI Studio" }],
  openGraph: {
    title: "UIKEY AI Studio — Photographers ka Intelligent Workspace",
    description: "Shoot se delivery tak, manage wedding leads, quotations, proofing galleries, and UPI settlements.",
    url: "https://uikey-ai-studio.vercel.app",
    siteName: "UIKEY AI Studio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UIKEY AI Studio — Photographers ka Intelligent Workspace",
    description: "Shoot se delivery tak, photographers ka intelligent workspace.",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
