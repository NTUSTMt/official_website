import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display, Crimson_Pro } from "next/font/google";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicHero from "@/components/DynamicHero";
import { Providers } from "@/components/Providers";
import "./globals.css";

const TopographyBackground = dynamic(() => import("@/components/TopographyBackground"), {
  ssr: false,
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: "臺灣科技大學登山社 | NTUST Mountaineering Club",
  description: "臺灣科技大學登山社官方網站 - 技術與荒野的交匯",
  manifest: "/manifest.json",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${crimsonPro.variable}`} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <TopographyBackground />
        <DynamicHero />
        <Providers>
          <div className="flex-1 relative">
            {children}
          </div>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}

