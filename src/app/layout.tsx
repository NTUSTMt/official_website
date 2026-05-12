import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display, Crimson_Pro } from "next/font/google";
import TopographyBackground from "@/components/TopographyBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

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
  title: "台科大登山社 | NTUST Mountaineering Club",
  description: "台科大登山社官方網站 - 技術與荒野的交匯",
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
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
