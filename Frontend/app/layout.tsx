import "./globals.css";

import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const fontBody = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"]
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "PulseLaunch",
    template: "%s | PulseLaunch"
  },
  description: "A Product Hunt-inspired feed for modern product launches.",
  applicationName: "PulseLaunch",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "PulseLaunch",
    description: "A Product Hunt-inspired feed for modern product launches.",
    url: "/",
    siteName: "PulseLaunch",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "PulseLaunch",
    description: "A Product Hunt-inspired feed for modern product launches."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(fontBody.variable, fontDisplay.variable, "min-h-screen font-sans")}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative min-h-screen">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[-140px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
            />
            <SiteHeader />
            <main className="container py-10">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
