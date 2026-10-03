import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { img, siteUrl } from "@/data/content";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const description =
  "An urban sanctuary in Port Harcourt. 65 rooms and suites, a spa, a private city beach and fine dining. Book direct.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Leonardo Spa Hotel & Suites · Luxury Hotel in Port Harcourt",
  description,
  keywords: ["Port Harcourt hotel", "Ada-George hotel", "luxury hotel Rivers State", "spa hotel Port Harcourt", "Leonardo Spa Hotel"],
  icons: { icon: "https://leonardospahotelandsuites.com/images/icons/icon-192x192.png" },
  openGraph: {
    type: "website",
    siteName: "Leonardo Spa Hotel & Suites",
    title: "Leonardo Spa Hotel & Suites · Port Harcourt",
    description,
    images: [{ url: img.facade, width: 1080, height: 864, alt: "Leonardo Spa Hotel & Suites" }],
    locale: "en_NG",
  },
  twitter: { card: "summary_large_image", images: [img.facade] },
};

export const viewport: Viewport = {
  themeColor: "#14110e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} is-loading`}>
      <body>
        <Providers>{children}</Providers>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
