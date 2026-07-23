import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@patterns/ui/src/globals.css";
import { AppProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patterns Editor",
  description: "Enterprise Web-to-Print Editor",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans`}
      >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
