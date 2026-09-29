import type { Metadata } from "next";
import { Caveat, Inter, Sora } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl } from "@/lib/supabase/env";
import "./globals.css";

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Canada Green",
    template: "%s | Canada Green",
  },
  description:
    "Crowdfunding platform for EV charging infrastructure and agriculture investment projects in Canada.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Canada Green",
    title: "Canada Green",
    description:
      "Crowdfunding platform for EV charging infrastructure and agriculture investment projects in Canada.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Canada Green",
    description:
      "Crowdfunding platform for EV charging infrastructure and agriculture investment projects in Canada.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${inter.variable} ${caveat.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
