import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "FlowPulse",
  description: "Smart stadium companion",
  manifest: "/manifest.json",
  appleWebApp: {
    title: "FlowPulse",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  }
};

export const viewport: Viewport = {
  themeColor: "#FF7A1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased font-body bg-bg0 text-fg0 min-h-[100dvh]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
