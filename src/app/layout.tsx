import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const bodoni = Bodoni_Moda({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Smells From Heaven – Premium Fragrances",
    template: "%s | Smells From Heaven",
  },
  description:
    "Where Every Smell Is A Heavenly Delight. Crafted By Heaven, Worn By Legends.",
  keywords: [
    "perfume",
    "fragrance",
    "attar",
    "oud",
    "luxury perfume",
    "Indian perfume",
    "smells from heaven",
  ],
  metadataBase: new URL("https://smellsfromheaven.com"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://smellsfromheaven.com",
    siteName: "Smells From Heaven",
    title: "Smells From Heaven – Premium Fragrances",
    description: "Where Every Smell Is A Heavenly Delight. Crafted By Heaven, Worn By Legends.",
    images: [{ url: "/logo.png", width: 800, height: 800, alt: "Smells From Heaven" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smells From Heaven",
    description: "Where Every Smell Is A Heavenly Delight. Crafted By Heaven, Worn By Legends.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-[#faf8f3] text-[#111111] font-[var(--font-inter)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Providers />
      </body>
    </html>
  );
}
