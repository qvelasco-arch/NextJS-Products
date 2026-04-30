import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vercel Swag Store",
    template: "%s | Vercel Swag Store",
  },
  description:
    "Official Vercel merchandise. Minimal gear for developers who ship.",
  openGraph: {
    type: "website",
    siteName: "Vercel Swag Store",
    title: "Vercel Swag Store",
    description:
      "Official Vercel merchandise. Minimal gear for developers who ship.",
    images: [
      {
        url: "https://i8qy5y6gxkdgdcv9.public.blob.vercel-storage.com/storefront/black-crewneck-t-shirt.png",
        width: 800,
        height: 800,
        alt: "Vercel Swag Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vercel Swag Store",
    description:
      "Official Vercel merchandise. Minimal gear for developers who ship.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[--background] text-[--foreground] antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
