import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/layout/Navbar";

const outfit = Outfit({
  variable: "--font-syne",   // var adı eyni qalır — heç nə dəyişmir
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ACCOUNTmarket",
  description: "Safe account marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body
        className={`${outfit.variable} ${inter.variable}`}
        style={{ background: '#0a0a0a', color: '#f1f5f9', minHeight: '100vh' }}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}